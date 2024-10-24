// @refresh reload
import { render } from 'solid-js/web';
import { AppRoot } from './views/app';

import './index.css';
import 'virtual:uno.css';

render( () => <AppRoot />, document.body );