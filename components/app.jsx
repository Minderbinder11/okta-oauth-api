import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import HomePage from './HomePage.jsx'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(HomePage);

if (module.hot) {
  console.log('in hot');
  module.hot.accept('./HomePage.jsx', () => { render(HomePage) })
}
