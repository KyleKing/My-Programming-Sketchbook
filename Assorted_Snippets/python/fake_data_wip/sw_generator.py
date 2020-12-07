"""Commands to demonstrate application functionality to customers."""

import shlex
from random import SystemRandom
from typing import Any, Callable, Dict, List, Optional, Tuple

import attr
import tmdbsimple as tmdb
from decorator import decorator
from decouple import config
from faker import Faker
from implements import Interface, implements
from memoization import cached

LOCALE_LIST: List[str] = ['it_IT', 'en_US', 'ja_JP', 'en_PH', 'en_GB']
FAKER: Faker = Faker(LOCALE_LIST)

tmdb.API_KEY = config('TMDB_API_KEY')

STUDIOS: List[Tuple[str, str]] = [
    ('20th', '20th Century Fox'),
    ('a1', 'A-1 Pictures'),
    ('amb', 'Amblin Partners'),
    ('bones', 'Studio Bones'),
    ('clas', 'Clasart Film'),
    ('const', 'Constantin Film'),
    ('dis', 'Walt Disney Pictures'),
    ('gfc', 'Gaumont Film Company'),
    ('hbo', 'HBO'),
    ('ig', 'Production IG'),
    ('jc ', 'JC Staff'),
    ('kyoani', 'Kyoto Animation'),
    ('lion', 'Lionsgate Films'),
    ('mad', 'Madhouse'),
    ('mgm', 'Metro-Goldwyn-Mayer Pictures'),
    ('nbc', 'Universal Pictures'),
    ('net', 'Netflix'),
    ('nord', 'Nordisk Film'),
    ('pa ', 'PA Works'),
    ('pie', 'Studio Pierrot'),
    ('pp', 'Paramount Pictures'),
    ('sony', 'Columbia Pictures'),
    ('stx', 'STXfilms'),
    ('sum', 'Summit Entertainment'),
    ('sun', 'Sunrise'),
    ('tristar', 'TriStar Pictures'),
    ('wb', 'Warner Bros'),
    ('wit', 'Wit Studio'),
]

STREAMING_SERVICES: List[Tuple[str, str]] = [
    ('aapl', 'Apple TV+'),
    ('acorn', 'Acorn TV'),
    ('apv', 'Amazon Prime Video'),
    ('att', 'AT&T TV Now'),
    ('brit', 'Britbox'),
    ('cbs', 'CBS All Access'),
    ('crit', 'The Criterion Channel'),
    ('cru', 'Crunchyroll'),
    ('dcu', 'DC Universe'),
    ('dis', 'Disney+'),
    ('espn', 'ESPN+'),
    ('ftv', 'fuboTV'),
    ('fun', 'Funimation'),
    ('goog', 'Google Play Store'),
    ('hbo', 'HBO Max'),
    ('hi', 'HIDIVE'),
    ('hulu', 'Hulu'),
    ('ifc', 'IFC'),
    ('kan', 'Kanopy'),
    ('mubi', 'Mubi'),
    ('nbc', 'Peacock TV'),
    ('net', 'Netflix'),
    ('ptv', 'Pluto.TV'),
    ('retro', 'RetroCrush'),
    ('rip', 'Quibi'),
    ('show', 'Showtime'),
    ('shu', 'Shudder'),
    ('sling', 'Sling TV'),
    ('starz', 'Starz'),
    ('tubi', 'Tubi'),
    ('vrv', 'VRV'),
    ('ytv', 'Youtube TV'),
]

NEXT_MONTH_COMMAND = 'next_month'


@attr.s(auto_attribs=True, kw_only=True)
class SimpleMovie:  # noqa: H601
    """Simple Movie Representation."""

    title: str
    budget: float
    revenue: int
    vote_count: int
    studios: List[str]


@decorator
def _set_max_id(func: Callable, max_id: int = 1000, *args: Any, **kwargs: Any) -> Callable:
    """Modulo divide the _id by the specific max_id."""
    _id = dict(kwargs).get('_id', args[0] if args else None)  # noqa: DAR101,DAR201
    return func(_id=(_id % max_id))  # noqa: S001


@_set_max_id(max_id=500)
@cached
def _get_movie(_id: int) -> SimpleMovie:
    """Request Movie Information.

    Args:
        _id: Movie ID

    Returns:
        SimpleMovie: summary for the specified movie ID

    """
    movie = tmdb.Movies(_id)
    movie.info()
    return SimpleMovie(
        title=movie.title, budget=movie.budget, revenue=movie.revenue,
        vote_count=movie.vote_count,
        studios=[_c['name'] for _c in movie.production_companies],
    )


# @_set_max_id(max_id=50)
@cached
def _get_genres(_id: int) -> List[str]:
    """Request Genre Information.

    Args:
        _id: Movie ID (note: the list of possible genres isn't available with tmdb)

    Returns:
        List[str]: list of genre names

    """
    genre = tmdb.Genres(_id)
    return [_g['name'] for _g in genre.movie_list()['genres']]


@cached
def shorten_name(name: str, min_len: int, max_len: int) -> str:
    """Convert the name to a safe, short string with a length in the specified range.

    Args:
        name: initial name
        min_len: minimum length of random length
        max_len: maximum length of random length

    Returns:
        str: randomly shortened name

    """
    max_len = SystemRandom().randrange(min_len, max_len)
    return name.replace(' ', '_')[:max_len]


def _create_demo(label: str, age: Optional[Tuple[int, int]]) -> Tuple[str, str]:
    """Create a demographic short and long label.

    Args:
        label: string label to identify the demographic group
        age: either None or a tuple of integers to specify min/max

    Returns:
        Tuple[str, str]: demographic group short and long name

    """
    unique_index = FAKER.unique.random_int()
    age_range = f'{age[0]}-{age[-1]}' if age else 'all'
    short_name = shorten_name(f'{unique_index} {age_range} {label}', 8, 20)
    long_name = f'{label} {age_range}'
    return (short_name, long_name)


@attr.s(auto_attribs=True, init=False)
class ShortNameRegistry:  # noqa: H601
    """Store of the short names for studios, services, and demographics."""

    studios: Dict[str, int] = {}
    services: Dict[str, int] = {}
    demographics: Dict[str, int] = {}
    movies: Dict[str, int] = {}


SHORT_NAME_REGISTRY = ShortNameRegistry()


# def create(short_name) -> None:
#     SHORT_NAME_REGISTRY.studios[short_name] = None
#
# def delete() -> None:
#     del SHORT_NAME_REGISTRY.studios[short_name]


class RandomCommandInterface(Interface):  # noqa: H601
    """Random Command Generator Interface."""

    def make_new(self) -> str:
        """Make a new command."""  # noqa: DAR201
        pass


class RandomBuilderAbstract:  # noqa: H601
    """Abstract base class for random command generators."""

    command_name: str
    generators: List[Callable]

    def make_new(self) -> str:
        """Make a new display call."""  # noqa: DAR201
        return shlex.join(self.command_name, [gen(FAKER.pyint()) for gen in self.generators])


@implements(RandomCommandInterface)
class RandomDisplayGeneral:  # noqa: H601
    """Make a random general display command."""

    command_names: List[str] = ['display_events', 'display_offers', 'display_time']

    def make_new(self) -> str:
        """Make a new display call."""  # noqa: DAR201
        return SystemRandom().choice(self.command_names)


@implements(RandomCommandInterface)
class RandomDisplaySpecific:  # noqa: H601
    """Make a random specific display command."""

    command_names: List[str] = ['display_demo', 'display_stream', 'display_studio']

    _short_names = []

    def add_short_names(self, short_names: List[str]) -> None:
        """Store additional short names to select from."""  # noqa: DAR101
        self._short_names.extend(short_names)

    def make_new(self) -> str:
        """Make a new display call."""  # noqa: DAR201
        ran = SystemRandom()
        return shlex.join([ran.choice(self.command_names), ran.choice(self._short_names)])


@implements(RandomCommandInterface)
class RanCreateDemo:  # noqa: H601
    """Make a random command for create_demo."""

    command_name: str = 'create_demo'

    def make_new(self) -> str:
        """Make a new display call."""  # noqa: DAR201
        num_accounts = SystemRandom().randrange(0, 10000) * 25
        movie = _get_movie(FAKER.pyint())
        return shlex.join([self.command_names, shorten_name(movie.title, 8, 15), movie.title, num_accounts])


# TODO: Have an enum with the order of Studio > Movie > Streamer > Demographic
# Need to have a parameters for the


if __name__ == '__main__':
    import sys
    from pathlib import Path

    from loguru import logger

    logger.remove()
    logger.add(sys.stdout, format='{message}')
    logger.add(f'{Path(__file__).stem}.log', mode='w')

    # breakpoint()

    # logger.debug(shorten_name('name', 0, 50))
    # logger.info(shorten_name.cache_info())

    # logger.info(_get_movie.cache_info())
    # logger.info(_get_movie(_id=100))
    # logger.info(_get_movie.cache_info())
    # logger.info(_get_movie(_id=5100))

    # logger.info(_get_genres.cache_info())
    # logger.info(_get_genres(_id=5))
    # logger.info(_get_genres(_id=10))
    # logger.info(_get_genres.cache_info())
    # logger.info(_get_genres(_id=510))
    # logger.info(_get_genres.cache_info())

    # logger.info(_create_demo('label', (18, 30)))
    # logger.info(_create_demo('label', None))

    # logger.info(NEXT_MONTH_COMMAND)

    # disp_gen = RandomDisplayGeneral()
    # with logger.contextualize(label='RandomDisplayGeneral'):
    #     logger.info(disp_gen.make_new())
    #     logger.info(disp_gen.make_new())
    #     logger.info(disp_gen.make_new())

    # disp_spec = RandomDisplaySpecific()
    # disp_spec.add_short_names(['option_1', 'option_2', 'option_3'])
    # with logger.contextualize(label='RandomDisplaySpecific'):
    #     logger.info(disp_spec.make_new())
    #     logger.info(disp_spec.make_new())
    #     logger.info(disp_spec.make_new())
    #     logger.info(disp_spec.make_new())

    # ran_create_demo = RanCreateDemo()
    # with logger.contextualize(label='RandomDisplaySpecific'):
    #     logger.info(ran_create_demo.make_new())
    #     logger.info(ran_create_demo.make_new())
    #     logger.info(ran_create_demo.make_new())
    #     logger.info(ran_create_demo.make_new())

    # breakpoint()

# 'create_demo [short name] [long name] [number of accounts]',
# 'create_demo age_40_50 "Viewers between 40 and 50" 800',
# 'create_studio [short name] [long name]',
# 'create_studio disney "Walt Disney Animation Studios"',
# 'create_event [type] [name] [year produced] [duration] [studio]  [license fee]',
# 'create_event ppv "30 for 30: Monaco" 2020 106 espn 3300',
# 'create_stream [short name] [long name] [subscription price]',
# 'create_stream apv "Amazon Prime Video" 12'
# 'offer_movie [streaming service] [movie name] [year produced]',
# 'offer_movie apv Mulan 1998',
# 'offer_ppv [streaming service] [pay-per-view name] [year produced] [viewing price]',
# 'offer_ppv net "30 for 30: Monaco" 2020 57',
# 'watch_event [demographic group] [percentage] [streaming service] [event name] [year produced]',
# 'watch_event age_40_50 30 apv Mulan 1998',
# 'update_demo [short name] [long name] [number of accounts]',
# 'update_event [name] [year produced] [duration] [license fee]',
# 'update_stream [short name] [long name] [subscription price]',
# 'retract_movie [streaming service] [movie name] [movie year]',
