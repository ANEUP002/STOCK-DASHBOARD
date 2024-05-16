// src/components/Stock.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Importing CSS for styling

const Stock = ({ ticker }) => {
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://127.0.0.1:31324/${ticker}`)
            .then(response => {
                setStockData(response.data);
                setError('');
            })
            .catch(error => {
                setError('Failed to fetch data');
                console.error('Error fetching stock data:', error);
            });
    }, [ticker]);

    if (error) return <div className="stock-container"><p>{error}</p></div>;
    if (!stockData) return <div className="stock-container"><p>Loading...</p></div>;

    return (
        <div className="stock-container">
            <h2>{stockData.name} ({stockData.ticker})</h2>
            <p className="stock-price">Price: ${stockData.price}</p>
            <p className="stock-volume">Volume: {stockData.volume}</p>
        </div>
    );
};

export default Stock;
