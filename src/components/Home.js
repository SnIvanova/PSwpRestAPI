import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Loader from '../loader.gif';
import { Link } from 'react-router-dom';
import clientConfig from '../client-config';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const wordPressSiteURL = clientConfig.siteUrl;
        const response = await axios.get(`${wordPressSiteURL}/wp-json/wp/v2/posts/?_embed`);
        if (response.data.length > 0) {
          setPosts(response.data);
        } else {
          throw new Error('No Posts Found');
        }
      } catch (error) {
        setError('An error occurred while fetching posts.');
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderPosts = () => {
    return (
      <div className="row row-cols-2 row-cols-md-4 g-4">
        {posts.map(post => (
          <div key={post.id} className="col">
            <div className="card h-100 border-dark">
              {post._embedded && post._embedded['wp:featuredmedia'] && (
                <img
                  src={post._embedded['wp:featuredmedia'][0].source_url}
                  className="card-img-top"
                  alt={post.title.rendered}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/post/${post.id}`} className="text-secondary font-weight-bold" style={{ textDecoration: 'none' }}>
                    {post.title.rendered}
                  </Link>
                </h5>
                <p className="card-text" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}></p>
              </div>
              <div className="card-footer">
                <small className="text-muted">{new Date(post.date).toLocaleString()}</small>
                <p className="card-author">By {post._embedded.author[0].name}</p>
                <Link to={`/post/${post.id}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      
      <div className="container">
        <h2 className="mt-5 mb-4">Latest Posts</h2>
        {loading && (
          <div className="text-center">
            <img className="loader" src={Loader} alt="Loading..." />
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && renderPosts()}
      </div>
    </React.Fragment>
  );
};

export default Home;
