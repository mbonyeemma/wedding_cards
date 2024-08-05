"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const image = new Image();
        image.src = '/card.jpg';

        image.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions to match image dimensions
            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            setImageLoaded(true);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = '/card.jpg';

        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            ctx.font = '30px Arial';
            ctx.fillStyle = '#133378';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const sanitizedName = name.replace(/&/g, 'and');
            const textX = canvas.width / 1.7;
            const textY = canvas.height / 3;
            ctx.fillText(sanitizedName, textX, textY);

            const dataURL = canvas.toDataURL('image/jpeg');
            setImageURL(dataURL);
            setLoading(false);
        };
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `${name}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const shareImage = () => {
      const encodedURL = encodeURIComponent(imageURL);
      const whatsappURL = `https://api.whatsapp.com/send?text=Check out this card I generated! ${encodedURL}`;
      window.open(whatsappURL, '_blank');
  };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <nav className="bg-white shadow-md p-4 flex justify-between w-full max-w-5xl">
                <div className="text-xl font-bold">Card Generator</div>
                <div className="space-x-4">
                    <button onClick={() => setImageURL(null)} className="text-blue-500 hover:underline">Home</button>
                </div>
            </nav>

            <div className="py-10 flex flex-col items-center w-full max-w-5xl">
                <h1 className="text-3xl font-bold mb-5">Dusabe Weds Lydia Card Generator</h1>
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
                    {imageURL && (
                        <div className="bg-white shadow-md rounded-lg p-5 w-full md:w-1/2 flex flex-col items-center">
                            <h2 className="text-2xl font-semibold mb-3">Your Generated Card</h2>
                            <img src={imageURL} alt="Generated Card" className="mb-5 w-full h-auto" />
                            <div className="flex justify-between w-full">
                                <button onClick={downloadImage} className="w-full mr-2 p-3 bg-green-500 text-white rounded hover:bg-green-600">
                                    Download
                                </button>
                                <button onClick={shareImage} className="w-full ml-2 p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                    Share
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
   }
