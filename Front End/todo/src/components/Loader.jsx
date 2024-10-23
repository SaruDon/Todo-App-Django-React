import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-between items-end w-16 h-8">
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>

            <style>
                {`
                    @keyframes bounce {
                        to {
                            transform: translateY(-20px);
                            opacity: 0.6;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;
