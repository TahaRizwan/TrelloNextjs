import { store } from '../reducer/store'
import {Provider} from 'react-redux'
import DragContext from '../components/DragContext'
// import styles from '../styles/App.css'
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
    <Provider store={store}>
    <main className='list-container'>
        <section className='list-wrapper'>
          <div className='list-draggable'>
            <DragContext />
          </div>
        </section>
      </main>
    </Provider>
    </>
  )
}