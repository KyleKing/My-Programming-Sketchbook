"""Wrapper for creating Logger instance."""

import logging


def init_logger(logger, log_fn):
    """Create logger instance.

    logger -- logger object `logging.getLogger(__name__)`
    log_fn -- Log filename

    """
    # Initialize
    open(log_fn, 'w').close()
    logger.setLevel(logging.DEBUG)

    # Create file handler to write log messages
    fh = logging.FileHandler(log_fn)
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(logging.Formatter('%(asctime)s %(filename)s:%(lineno)d    %(message)s'))
    logger.addHandler(fh)
    # Create console handler to print to STDOUT
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    ch.setFormatter(logging.Formatter('%(filename)s:%(lineno)d> %(message)s'))
    logger.addHandler(ch)

    return logger
