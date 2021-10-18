import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createDeck } from '../utils/api';

function CreateDeck() {
  const initialFormState = {
    name: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const history = useHistory();

  const onChangeHandler = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await createDeck(formData);
    setFormData(initialFormState);
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
          <li className='breadcrumb-item active' aria-current='page'>
            Create Deck
          </li>
        </ol>
      </nav>
      <form onSubmit={submitHandler}>
        <h1 className='my-4 text-center'>Create Deck</h1>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            name='name'
            id='name'
            className='form-control form-control-lg'
            type='text'
            placeholder='Deck Name'
            onChange={onChangeHandler}
            value={formData.name}
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
            onChange={onChangeHandler}
            value={formData.description}
            required
          ></textarea>
        </div>
        <Link to='/' className='mr-2'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => history.push('/')}
          >
            Cancel
          </button>
        </Link>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </React.Fragment>
  );
}

export default CreateDeck;
