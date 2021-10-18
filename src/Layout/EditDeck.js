import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { readDeck, updateDeck } from '../utils/api';

function EditDeck() {
  const mountedRef = useRef(false);
  const initialState = { name: '', description: '' };
  const [editDeckFormData, setEditDeckFormData] = useState(initialState);

  const { deckId } = useParams();
  const history = useHistory();

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
          setEditDeckFormData(() => loadedDeck);
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

  const changeHandler = ({ target }) => {
    setEditDeckFormData((currentState) => ({
      ...currentState,
      [target.name]: target.value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await updateDeck(editDeckFormData);
    history.push(`/decks/${response.id}`);
  };

  return (
    <React.Fragment>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
              <i className='fas fa-home'></i> Home
            </Link>
          </li>
          <li className='breadcrumb-item'>
            <Link to={`/decks/${deckId}`}>
              {editDeckFormData.name ? editDeckFormData.name : 'Loading...'}
            </Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Edit Deck
          </li>
        </ol>
      </nav>
      <form>
        <h1 className='my-4 text-center'>Edit Deck</h1>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            name='name'
            id='name'
            className='form-control form-control-lg'
            type='text'
            placeholder='Deck Name'
            onChange={changeHandler}
            value={editDeckFormData.name}
            required
          ></input>
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            className='form-control'
            id='description'
            name='description'
            rows='5'
            placeholder='Brief description of the deck'
            onChange={changeHandler}
            value={editDeckFormData.description}
            required
          ></textarea>
        </div>
        <Link to='/' className='mr-2'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => history.push(`/decks/${deckId}`)}
          >
            Cancel
          </button>
        </Link>
        <button
          type='submit'
          className='btn btn-primary'
          onSubmit={submitHandler}
        >
          Submit
        </button>
      </form>
    </React.Fragment>
  );
}

export default EditDeck;
