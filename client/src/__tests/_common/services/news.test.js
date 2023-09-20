import {cleanup} from '@testing-library/react'
import NewsService from '../../../_common/services/news.js'

/**
 * News has legacy capability for creating articles, however current
 * implementation only handles loading.
 */

afterEach(cleanup);

jest.mock('../../../_utilities/serviceUtils');

it('should fetch news', () => {
    const expected_response = {'data':[{
        articletitle: 'articletitle',
        articlesubheading: 'articlesubheading',
        articlemessage: 'articlemessage',
        articledate: 'articledate'
    }]};

    const promise = NewsService.getNewsHistory();

    return promise.then(x => expect(x).toEqual(expected_response));
});