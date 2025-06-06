import React from 'react';
import Banner from '../Shared/Components/Banner';
import Hero from '../Shared/Components/Hero';

const Home = () => {
    return (
        <div>
            <header >
                <Hero></Hero>
            </header>
            <main>
                <section className='my-24'>
                    <Banner></Banner>
                </section>
            </main>
        </div>
    );
};

export default Home;