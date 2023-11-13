import React from 'react';
import NewsService from '../../_common/services/news';
import '../../_common/assets/css/public-homepage.css';
import powercat from '../../_common/assets/img/powercat.png';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';

/**
 * 
 * @returns The Homepage showing the news and the k-state banner
 * @author Riley Mueller
 */
export default function Home(){

    const [news, setNews] = useState([]);

    useEffect(()=>{
        NewsService.getNewsHistory().then((response) => {
            const data = response.data;
            const notes = generateNewsTable(data);
            setNews(notes);
        }).catch((resErr) => console.log('There was an error while loading news\n',resErr));
    }, []);
    
    return (
        <div className="home">
            <div className="banner">
                <br /><h1 id="title">Welcome To Kansas State University</h1>
                <img src={powercat} alt="Powercat" id="logo"></img>
            </div>
            <div id="article-field">
                {news}
            </div>
        </div>
    );
}

/**
 * Takes json of news articles and returns html of news articles
 * @param {list} news a list of json objects representing news articles
 * @returns {list} a list of divs containing html for news articles
 * @author Riley Mueller
 */
function generateNewsTable(news) {
    const notes = [];
    news.forEach((data, index) => {
        notes.push(
            <div key={index} id="news-article">
                <Card>
                    <Card.Body>
                        <Card.Title>{data.articletitle}</Card.Title>
                        <Card.Subtitle>{data.articlesubheading}</Card.Subtitle>
                        <Card.Text>
                        {data.articlemessage}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        );
    });
    return notes;
}