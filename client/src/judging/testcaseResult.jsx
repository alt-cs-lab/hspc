import React from 'react';
import { Button } from 'react-bootstrap';


/*
*   @author: May Phyo 
*/
export default class testcaseResult extends React.Component {
    /** Add the onClick event for each case here, such as storing results in scorecard, and displaying it to masterview page */
    render() {
        return (
            <div className={'result'}
               style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
              <div >
              <Button 
                   style={{height: '100px', width : '200px'}}

                bsStyle="success"  
                size="lg">
                 <h1>Pass</h1>

               </Button>
               <Button 
                   style={{height: '100px', width : '200px'}}

               bsStyle ="danger" 
               size="lg">
                
                    
                <h1>Fail</h1>
               </Button>
              
              </div>
            
        
             
            </div>
        );
    }
}