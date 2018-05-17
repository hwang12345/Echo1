import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';

import injectTapEventPlugin from 'react-tap-event-plugin';

import { renderRoutes } from '../imports/ui/Routers.jsx';

Meteor.startup(
    ()=> {
        injectTapEventPlugin(); //初始化Touch事件
        render(renderRoutes(), document.getElementById('app-container'));
    }
);
