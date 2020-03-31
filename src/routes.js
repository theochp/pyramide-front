import Room from './Room'
import Index from './Index'

export default [
  { path: '/', component: Index },
  { path: '/room/:id', component: Room },
]