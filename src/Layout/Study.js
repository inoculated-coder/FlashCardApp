import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readDeck } from '../utils/api';

function Study() {
  const mountedRef = useRef(false);
  const initialState = {
    deck: { name: 'loading...', cards: [] },
    isCardFlipped: false,
    currentIndex: 0,
  };

  const [studyDeckState, setStudyDeckState] = useState(initialState);
  const { deck, isCardFlipped, currentIndex } = studyDeckState;

  const { deckId } = useParams();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        if (mountedRef.current) {
          setStudyDeckState((currentState) => ({
            ...currentState,
            deck: loadedDeck,
          }));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    }
    loadDeck();
    return () => {
      abortController.abort();
    };
  }, [deckId]);

  function flipCardHandler() {
    setStudyDeckState({
      ...studyDeckState,
      isCardFlipped: !studyDeckState['isCardFlipped'],
    });
  }

  function getNextCardHandler() {
    const { cards } = deck;
    if (currentIndex === cards.length - 1) {
      const response = window.confirm(
        'Do you want to restart the deck and study again?'
      );
      if (response) {
        setStudyDeckState((currentState) => ({
          ...currentState,
          currentIndex: 0,
        }));
      }
    } else {
      setStudyDeckState((currentState) => ({
        ...currentState,
        currentIndex: currentState.currentIndex++,
        isCardFlipped: !currentState.isCardFlipped,
      }));
    }
  }

  const breadcrumb = (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumb'>
        <li className='breadcrumb-item'>
          <Link to='/'>
            <i className='fas fa-home'></i> Home
          </Link>
        </li>
        <li className='breadcrumb-item'>
          <Link to={`/decks/${deckId}`}>{deck.name}</Link>
        </li>
        <li className='breadcrumb-item active' aria-current='page'>
          Study
        </li>
      </ol>
    </nav>
  );

  if (deck.cards.length <= 2) {
    return (
      <React.Fragment>
        {breadcrumb}
        <div className='card'>
          <div className='card-body'>
            <h1>{deck.name}: Study</h1>
            <h2 className='card-title'>Not enough cards.</h2>
            <p className='card-text'>
              You need at least 3 cards to study. Please add more cards to this
              deck.
            </p>
            <Link to={`/decks/${deckId}/cards/new`}>
              <button type='button' className='btn btn-primary'>
                <i className='fas fa-plus'></i> Add Card
              </button>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {breadcrumb}
        <h1 className='text-center'>Currently Studying: {deck.name} </h1>
        <div className='card'>
          <div className='card-body'>
            <h4 className='card-title'>
              Card {currentIndex + 1} of {deck.cards.length}
            </h4>
            <h5 className='card-text'>
              {!isCardFlipped
                ? `Question: ${deck.cards[currentIndex].front}`
                : `Answer: ${deck.cards[currentIndex].back}`}
            </h5>
          </div>
          <button
            type='button'
            className='btn btn-secondary py-3'
            onClick={() => flipCardHandler()}
          >
            Flip
          </button>
          {isCardFlipped && (
            <button
              className='btn btn-primary py-3'
              onClick={getNextCardHandler}
            >
              Next
            </button>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Study;
