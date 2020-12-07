"""Test the demo_commands.py file."""

from memoization import cached

from sw_client.demo_commands import _get_movie, _set_max_id


def test_max_id():
    """Test _test_max_id."""
    @_set_max_id(max_id=10)
    @cached
    def _test_max_id(_id: int) -> int:
        return _id

    _test_max_id.cache_clear()  # act

    _test_max_id(0)
    _test_max_id(10)
    _test_max_id(1e7)
    assert _test_max_id.cache_info().current_size == 1
    _test_max_id(11)
    assert _test_max_id.cache_info().current_size == 2
    _test_max_id(1)
    assert _test_max_id.cache_info().hits == 3


def test_get_movie():
    """Test _get_movie."""
    movie = _get_movie(_id=100)  # act

    assert movie.title == 'Lock, Stock and Two Smoking Barrels'
    assert movie.budget == 1350000
    assert movie.revenue >= 28356188
    assert movie.vote_count >= 4351
    assert movie.studios[1] == 'The Steve Tisch Company'
    assert movie == _get_movie(_id=600)  # Check that caching works with max=500
    assert _get_movie.cache_info().hits == 1
