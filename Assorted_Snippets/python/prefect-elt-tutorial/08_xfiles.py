"""Example Prefect flow with SQLite.

Source: https://docs.prefect.io/core/advanced_tutorials/advanced-mapping.html

Also posted to Github: https://github.com/PrefectHQ/prefect/pull/4159

"""

import requests
from bs4 import BeautifulSoup
from prefect import Flow, Parameter, task, unmapped
from prefect.executors import LocalDaskExecutor
from prefect.tasks.database import SQLiteScript


@task(tags=["web"])
def retrieve_url(url):
    """
    Given a URL (string), retrieves html and
    returns the html as a string.
    """

    html = requests.get(url)
    if html.ok:
        return html.text
    else:
        raise ValueError("{} could not be retrieved.".format(url))


@task
def scrape_dialogue(episode_html):
    """
    Given a string of html representing an episode page,
    returns a tuple of (title, [(character, text)]) of the
    dialogue from that episode
    """

    episode = BeautifulSoup(episode_html, 'html.parser')

    title = episode.title.text.rstrip(' *').replace("'", "''")
    convos = episode.find_all('b') or episode.find_all('span', {'class': 'char'})
    dialogue = []
    for item in convos:
        who = item.text.rstrip(': ').rstrip(' *').replace("'", "''")
        what = str(item.next_sibling).rstrip(' *').replace("'", "''")
        dialogue.append((who, what))
    return (title, dialogue)


@task
def create_episode_list(base_url, main_html, bypass):
    """
    Given the main page html, creates a list of episode URLs
    """

    if bypass:
        return [base_url]

    main_page = BeautifulSoup(main_html, 'html.parser')

    episodes = []
    for link in main_page.find_all('a'):
        url = link.get('href')
        if 'transcrp/scrp' in (url or ''):
            episodes.append(base_url + url)

    return episodes


create_db = SQLiteScript(name="Create DB",
                         db="xfiles_db.sqlite",
                         script="CREATE TABLE IF NOT EXISTS XFILES (EPISODE TEXT, CHARACTER TEXT, TEXT TEXT)",
                         tags=["db"])


@task
def create_episode_script(episode):
    title, dialogue = episode
    insert_cmd = "INSERT INTO XFILES (EPISODE, CHARACTER, TEXT) VALUES\n"
    values = ',\n'.join(["('{0}', '{1}', '{2}')".format(title, *row) for row in dialogue]) + ";"
    return insert_cmd + values


insert_episode = SQLiteScript(name="Insert Episode",
                              db="xfiles_db.sqlite",
                              tags=["db"])


def main():
    with Flow("xfiles") as flow:
        url = Parameter("url")
        bypass = Parameter("bypass", default=False, required=False)
        home_page = retrieve_url(url)
        episodes = create_episode_list(url, home_page, bypass=bypass)
        episode = retrieve_url.map(episodes)
        dialogue = scrape_dialogue.map(episode)

        db = create_db()
        ep_script = create_episode_script.map(episode=dialogue)
        # FYI: This is the line of interest
        # final = insert_episode.map(ep_script, upstream_tasks=[unmapped(db)])  # original
        final = insert_episode.map(script=ep_script, upstream_tasks=[unmapped(db)])  # modified

    executor = LocalDaskExecutor()

    # Use the bypass parameter to scrape a single transcript
    state = flow.run(parameters={"url": "http://www.insidethex.co.uk/transcrp/tlg105.htm",
                                 "bypass": True},
                     executor=executor)


if __name__ == "__main__":
    main()
