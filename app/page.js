"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allCards, setAllCards] = useState([]);
    const [viewAll, setViewAll] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/generate-card', { name }, { responseType: 'blob' });
            const imageUrl = URL.createObjectURL(response.data);
            setImage(imageUrl);
            fetchAllCards();
        } catch (error) {
            console.error('Error generating card:', error);
        }
        setLoading(false);
    };

    const fetchAllCards = async () => {
        try {
            const response = await axios.get('/api/generate-card');
            setAllCards(response.data);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const downloadImage = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const shareImage = (url) => {
        if (navigator.share) {
            navigator.share({
                title: 'Wedding Invitation',
                text: 'Hello, you are invited',
                url,
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch((err) => {
                console.error('Error sharing:', err);
            });
        } else {
            console.warn('Web Share API is not supported in this browser.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4 flex justify-between">
                <div className="text-xl font-bold">Card Generator</div>
                <div className="space-x-4">
                    <button onClick={() => setViewAll(false)} className="text-blue-500 hover:underline">Home</button>
                    <button onClick={() => { setViewAll(true); fetchAllCards(); }} className="text-blue-500 hover:underline">View All Cards</button>
                </div>
            </nav>

            {viewAll ? (
                <div className="py-10 flex flex-col items-center">
                    <h1 className="text-3xl font-bold mb-5">All Generated Cards</h1>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4">
                        {allCards.map((card, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                                <img src={card} alt={`Generated Card ${index}`} className="w-full h-auto mb-3" />
                                <div className="text-center mb-2">Name: {card.split('/').pop().replace(/_/g, ' ').replace('.jpeg', '')}</div>
                                <div className="flex justify-between w-full">
                                    <button onClick={() => downloadImage(card, `card_${index}`)} className="w-full mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
                                        Download
                                    </button>
                                    <button onClick={() => shareImage(card)} className="w-full ml-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                        Share
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="py-10 flex flex-col items-center">
                    <h2 className="">Dusabe Weds Lydia Card Generator</h2>
                    <p className="mb-10 text-gray-700 text-center">Enter a name and see the generated card on the right.</p>
                    <div className="flex flex-wrap justify-center gap-10 w-full px-4">
                        <div className="bg-white shadow-md rounded-lg p-5 w-full md:w-1/2 flex flex-col items-center">
                            <h2 className="text-2xl font-semibold mb-3">Generate Your Card</h2>
                            <form onSubmit={handleSubmit} className="w-full">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded mb-4"
                                />
                                <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Generate Card
                                </button>
                            </form>
                            {loading && <p className="mt-3 text-gray-500">Generating...</p>}
                        </div>
                        {image && (
                            <div className="bg-white shadow-md rounded-lg p-5 w-full md:w-1/2 flex flex-col items-center">
                                <h2 className="text-2xl font-semibold mb-3">Your Generated Card</h2>
                                <img src={image} alt="Generated Card" className="mb-5 w-full h-auto" />
                                <div className="flex justify-between w-full">
                                    <button onClick={() => downloadImage(image, name)} className="w-full mr-2 p-3 bg-green-500 text-white rounded hover:bg-green-600">
                                        Download
                                    </button>
                                    <button onClick={() => shareImage(image)} className="w-full ml-2 p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                        Share
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
