import React from 'react';
import NewsService from '../_common/services/news';
import EventService from '../_common/services/event';
import '../_common/assets/css/public-homepage.css';
import powercat from '../_common/assets/img/powercat.png';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';

/**
 * 
 * @returns The Homepage showing the news and the k-state banner
 * @author Riley Mueller
 */
export default function Home(){

    const [news, setNews] = useState([]);
    // Highlight Event is either the most upcoming event or if there are none upcoming, the most recent event passed.
    const [highlightEvent, setHighlightEvent] = useState(null);

    useEffect(()=>{
        EventService.getHighlightEvent()
        .then((response) => {
            if (response.ok && response.data[0] != null){
                setHighlightEvent(response.data[0]);
            }
        }).catch((resErr) => console.log('There was an error while retrieving events\n',resErr));

        // NewsService.getNewsHistory().then((response) => {
        //     const data = response.data;
        //     const notes = generateNewsTable(data);
        //     setNews(notes);
        // }).catch((resErr) => console.log('There was an error while loading news\n',resErr));
    }, []);
    
    return (
        <div className="home">
            <div className="banner">
            {
            highlightEvent !== null ? (
            <div>
                <h1 id="title">{highlightEvent.eventname}</h1>
                <h2 id="location">{highlightEvent.eventlocation}</h2>
                <h2 id="date">{highlightEvent.eventdate} @ {highlightEvent.eventtime}</h2>
                <h5 id="description">{highlightEvent.eventdescription}</h5>
            </div>
            ) : (
            <h1 id="title">No Contests</h1>
            )
            }
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