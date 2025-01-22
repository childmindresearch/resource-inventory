import { useState, useEffect } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { Card, Container, Row, Col, Alert, Form, InputGroup, Button } from 'react-bootstrap';

interface Resource {
  name: string;
  description: { [key: string]: string[] };
  url: string;
  [key: string]: any;
}

function App() {
  const [resources, setResources] = useState<{ [key: string]: Resource }>({});
  const [resourceDescriptions, setResourceDescriptions] = useState<{ [key: string]: Resource }>({});
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/birajstha/d6f5e1ed12139ea21468b10dd5eacd1a/raw/b030211505ea40005f1c4214653c9cd3d1857559/resource_inventory.yaml');
        const data = yaml.load(response.data) as { [key: string]: Resource };

        setResources(data);
        const descriptions: { [key: string]: Resource } = {};
        Object.keys(data).forEach(key => {
          descriptions[key] = data[key];
        });
        setResourceDescriptions(descriptions);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to fetch resources. Please try again later.');
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-white' : '';
  }, [darkMode]);

  const filteredResources = Object.keys(resources).filter(key =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="my-5" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center mb-0">Resource Inventory</h1>
        <Button variant={darkMode ? 'light' : 'dark'} onClick={() => setDarkMode(!darkMode)}>
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i> {darkMode ? '' : ''}
        </Button>
      </div>
      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <div className="mb-4">
        <Button 
          href="https://childmindresearch.github.io/blockbuster/" 
          className={`ml-2 ${darkMode ? 'btn-light' : 'btn-dark'}`}>Search Nodeblock instead?
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {filteredResources.map((key) => (
        <div key={key} className="mb-5">
          <Row>
            <Col>
            <Card
            className={`h-100 shadow-sm ${darkMode ? ' text-white' : ''}`}
            style={{
              backgroundColor: darkMode ? '#343a40' : '#f8f9fa',
              borderColor: darkMode ? '#454d55' : '#e9ecef'
            }}
          >
                <Card.Body>
                  <Card.Title className="text-truncate">{key}</Card.Title>
                  {Object.keys(resourceDescriptions[key] || {}).map((descKey) => (
                    <div key={descKey} className="container p-3 my-3">
                      <Card.Text className="font-weight-bold">{descKey}</Card.Text>
                      <ul>
                        {resourceDescriptions[key][descKey].map((descValue: string, descIndex: number) => (
                        <li key={descIndex}>
                          <Card.Text key={descIndex} className="text">{descValue}</Card.Text>
                        </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ))}
    </Container>
  );
}

export default App;