import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap'; 
import Loader from "../loader.gif";
import clientConfig from '../client-config';

function SinglePost() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({});
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const wordPressSiteURL = clientConfig.siteUrl;
      setLoading(true);
      try {
        const response = await axios.get(`${wordPressSiteURL}/wp-json/wp/v2/posts/${id}`);
        if (response.data && Object.keys(response.data).length) {
          console.log('Response Data:', response.data);
          setPost(response.data);
        } else {
          setError('No Post Found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response ? err.response.data.message : 'Error fetching post');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    console.log('Post:', post);
  }, [post]);

  useEffect(() => {
    if (error) {
      console.error('Error:', error);
    }
  }, [error]);

  return (
    <>
      {error && <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />}
      {loading && <img className="loader" src={Loader} alt="Loader" />}
      {Object.keys(post).length > 0 && (
        <Container className="mt-5">
          <Row>
            <Col md={8}>
              <Card border="light" className="shadow">
                {post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0] && (
                  <Card.Img
                    variant="top"
                    src={post._embedded['wp:featuredmedia'][0].source_url}
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
        </Container>
      )}
    </>
  );
}

export default SinglePost;
