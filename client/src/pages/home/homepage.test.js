/**
 * Testing for the landing homepage
 */

import {cleanup, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../home/homepage'
import NewsService from '../../_common/services/news';

afterEach(cleanup);

// see about mocking at ServiceUtils level, were calling jest.mock on it automatically will populate with test values
jest.mock('../../_utilities/serviceUtils');

it('displays welcome text', async () => {
    
    render(
        <Home/>
    );
    
    return screen.findByText('Welcome To Kansas State University').then(x => expect(x).toBeTruthy());
})

it('loads the news', async () => {
    const expected_data = {'data':[{
        articletitle: 'articletitle',
        articlesubheading: 'articlesubheading',
        articlemessage: 'articlemessage',
        articledate: 'articledate'
    }]};
    
    const {debug} = render(
        <Home/>
    );
    
    debug();
    
    return screen.findByText('articlemessage').then(x => expect(x).toBeTruthy());
})