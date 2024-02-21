import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import clientConfig from '../client-config';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    console.log('Searching...');
    setLoading(true);
    try {
      const wordPressSiteURL = clientConfig.siteUrl;
      console.log('API URL:', `${wordPressSiteURL}/wp-json/wp/v2/search?search=${searchTerm}`);
      const response = await axios.get(
        `${wordPressSiteURL}/wp-json/wp/v2/search?search=${searchTerm}`
      );
      console.log('Response:', response);
      if (response.data && Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching:', error);
      setError('Error fetching search results. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container className='my-3'>
      <Form>
        <Form.Group controlId="searchTerm">
          <Form.Control
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Form>
      {error && <p className="text-danger">{error}</p>}
      <ListGroup className="mt-3">
            {searchResults.map((result) => (
                <ListGroup.Item key={result.id}>
                <a href={result.url}>{result.title}</a>
                </ListGroup.Item>
            ))}
            </ListGroup>
    </Container>
  );
}

export default Search;
