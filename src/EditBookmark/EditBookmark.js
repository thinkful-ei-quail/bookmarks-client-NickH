import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    error: null,
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = this.state;
    const bookmarkId = this.props.match.params.bookmarkId;
    const updatedBookmark = { title, url, description, rating };
    this.setState({ error: null })

    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedBookmark),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res
      })
      .then(data => {
        this.context.updateBookmark(updatedBookmark, bookmarkId)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  titleChanged(title) {
    this.setState({
      title
    });
  }

  urlChanged(url) {
    this.setState({
      url
    });
  }

  descriptionChanged(description) {
    this.setState({
      description
    });
  }

  ratingChanged(rating) {
    this.setState({
      rating
    });
  }

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status)
      }
      return res.json()
    })
    .then(bookmark => this.setState({
      title: bookmark.title,
      url: bookmark.url,
      rating: bookmark.rating,
      description: bookmark.description
    }))
    .catch(error => this.setState({ error }));
  };

  render() {
    const { error, title, url, description, rating } = this.state;
    return (
      <section className='EditBookmark'>
        <h2>Create a bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={title}
              onChange={e => this.titleChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              value={url}
              onChange={e => this.urlChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={e => this.descriptionChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={rating}
              onChange={e => this.ratingChanged(Number(e.target.value))}
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  };
};

export default EditBookmark;
