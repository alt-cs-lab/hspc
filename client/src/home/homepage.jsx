import React from 'react';
import EventService from '../_common/services/event';
import '../_common/assets/css/public-homepage.css';
import { useEffect, useState } from 'react';
import HSPC_Logo from '../_common/assets/img/hspc-logo-black.png';
import ProgressBar from 'react-bootstrap/ProgressBar';

const constants = require('../_utilities/constants');

/**
 * 
 * @returns The Homepage showing the news and the k-state banner
 * @author Riley Mueller
 */
export default function Home(){

    // Highlight Event is either the most upcoming event or if there are none upcoming, the most recent event passed.
    const [highlightEvent, setHighlightEvent] = useState(null);

    useEffect(()=>{
        EventService.getHighlightEvent()
        .then((response) => {
            if (response.ok && response.data[0] != null){
                setHighlightEvent(response.data[0]);
            }
        }).catch((resErr) => console.log('There was an error while retrieving events\n',resErr));
    }, []);
    
    return (
        <div className="home">
            <div className="banner">
                <div>
                    <img className="m-3" width="25%" src={HSPC_Logo} alt="HSPC"></img>
                </div>
                <br/>
                <ProgressBar id="purple-progress" animated style={{ width: "60%", margin: "auto" }} now={100} />
                <br/>
                {
                highlightEvent !== null ? (
                <div id="back-layout">
                    <h1 id="title">{highlightEvent.eventname}</h1>
                    <h2 id="header">{highlightEvent.eventlocation}</h2>
                    <h2 id="header">{constants.dateFormat(highlightEvent.eventdate)} @ {constants.timeFormat(highlightEvent.eventstarttime)} - {constants.timeFormat(highlightEvent.eventendtime)}</h2>
                    <p id="description-paragraph">{highlightEvent.eventdescription}</p>
                </div>
                ) : (
                <h1 id="title">No Contests</h1>
                )
                }       
            </div>
        </div>
    );
}