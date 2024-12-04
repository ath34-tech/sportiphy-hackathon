// src/components/NewsSection.js
import React from 'react';
import NewsCard from './NewsCard';

const NewsSection = ({ title, articles }) => {
    return (
        <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="flex flex-wrap">
                {articles.map((article, index) => (
                    <NewsCard key={index} title={article.title} summary={article.summary} />
                ))}
            </div>
        </section>
    );
};

export default NewsSection;