import * as ConstantTypes from '../AppConstants';

import { replace } from 'connected-react-router';

export default store => next => action => {

    const state = store.getState();

    let { search, pathname } = state.router.location;

    if (action.type === ConstantTypes.SET_TRACK_REQUEST_ID) {
        pathname.split('/').length === 2 && store.dispatch(replace({
            pathname: `${pathname}/${action.payload}`
        }));
    };

    if (action.updateUrl) {

        let { type, value } = action.updateUrl;

        if (Number.isInteger(type)) {
            type = state.payloads.filters.filter(filter => filter.id === type)[0].type;
        };

        search = search.split('&')
        search = search.map(item => item.split('='));

        if (value) {
            search.push([ type, value ]);
            search = search.map(item => item.length === 2 ? item.join('=') : '');
            search = search.filter(item => item.includes('=')).join('&');
        } else {
            search = search.filter(item => {
                if (item.length === 2) {
                    const temp = item[0].includes('?') ? item[0].slice(1) : item[0];
                    return temp !== type;
                };
            });
            search = search.map(item => item.length === 2 && item.join('='));
            search = search.join('&');
        };

        store.dispatch(replace({
            search
        }));

    };

    return next(action);

};
