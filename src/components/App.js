import React from 'react'
import Planets from '../components/Planets'
import Search from '../components/Search'
import { Header } from 'semantic-ui-react'
import { Parallax } from 'react-parallax'

const App = () => (
  <div>
  	<Parallax bgImage="images/header.jpg" strength={-400}>
		<Header style={{ fontWeight: 100, fontSize: '40pt', textAlign: 'center', paddingTop: 200 }} inverted as='h1'>Planet Search</Header>
    	<Search />
    </Parallax>
  	<Planets />
  </div>
)

export default App
