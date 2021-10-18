import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
               Home
            </Link>
          </li>
        </ol>
      </nav>
      <div className=' card'>
        <div className='NotFound card-body d-flex justify-content-center'>
          <h1> Not Found</h1>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
