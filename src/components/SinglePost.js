import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, Link  } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'; 
import Loader from "../loader.gif";
import clientConfig from '../client-config';

function SinglePost() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { id } = useParams();
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const wordPressSiteURL = clientConfig.siteUrl;
      setLoading(true);
      try {
        const postResponse = await axios.get(`${wordPressSiteURL}/wp-json/wp/v2/posts/${id}`);
        if (postResponse.data && Object.keys(postResponse.data).length) {
          setPost(postResponse.data);
          fetchRelatedPosts(postResponse.data);
          fetchComments(postResponse.data);
          
          const featuredMediaId = postResponse.data.featured_media;
          if (featuredMediaId) {
            const mediaResponse = await axios.get(`${wordPressSiteURL}/wp-json/wp/v2/media/${featuredMediaId}`);
            if (mediaResponse.data && Object.keys(mediaResponse.data).length) {
              setPost(prevPost => ({
                ...prevPost,
                featured_media: mediaResponse.data
              }));
            }
          }
        } else {
          setError('No Post Found');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching post');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const fetchRelatedPosts = async (currentPost) => {
    const categoryIds = currentPost.categories.map(category => category.id).join(',');
    
    if (!categoryIds) {
      console.error('No categories found for the current post');
      setRelatedPosts([]); 
      return;
    }
  
    const wordPressSiteURL = clientConfig.siteUrl;
    try {
      const response = await axios.get(`${wordPressSiteURL}/wp-json/wp/v2/posts?categories=${categoryIds}&per_page=3`);
      setRelatedPosts(response.data.filter(post => post.id !== currentPost.id));
    } catch (err) {
      console.error('Error fetching related posts:', err);
    }
  };

  const fetchComments = async (currentPost) => {
    const wordPressSiteURL = clientConfig.siteUrl;
    try {
      const response = await axios.get(`${wordPressSiteURL}/wp-json/wp/v2/comments?post=${currentPost.id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCommentSubmit = async () => {
    console.log('Submitting comment:', commentText);
    const wordPressSiteURL = clientConfig.siteUrl;
    try {
      const response = await axios.post(`${wordPressSiteURL}/wp-json/wp/v2/comments`, {
        post: id,
        content: commentText
      });
      console.log('Response from comment submission:', response);
      if (response.status === 201) {
        //fetchComments(post);
        //setCommentText('');
      } else {
        console.error('Failed to post comment:', response.statusText);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };


  return (
    <>
      {error && <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />}
      {loading && <img className="loader" src={Loader} alt="Loader" />}
      {Object.keys(post).length > 0 && (
        <Container className="mt-5">
          <Row>
            <Col md={8}>
              <Card border="light" className="shadow">
                {post.featured_media && (
                  <Card.Img
                    variant="top"
                    src={post.featured_media.source_url}
                    className="card-img-top"
                    alt={post.title.rendered}
                  />
                )}
                <Card.Body>
                  <Card.Title>{post.title.rendered}</Card.Title>
                  <Card.Text dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                </Card.Body>
                <Card.Footer className="text-muted">{new Date(post.date).toLocaleString()}</Card.Footer>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              {relatedPosts.length === 0 && <p>No related posts found.</p>}
              {relatedPosts.length > 0 && (
                <>
                  <h4>Related Posts</h4>
                  <ul className="list-group">
                    {relatedPosts.map(relatedPost => (
                      <li key={relatedPost.id} className="list-group-item">
                        <Link to={`/post/${relatedPost.id}`}>{relatedPost.title.rendered}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              <h4>Comments</h4>
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group controlId="commentText">
                  <Form.Label>Your Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              <ul>
                {comments.map(comment => (
                  <li key={comment.id}>
                    <strong>{comment.author_name}</strong>: {comment.content.rendered}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default SinglePost;
