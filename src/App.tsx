/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route>404: Sayfa Bulunamadı</Route>
    </Switch>
  );
}

