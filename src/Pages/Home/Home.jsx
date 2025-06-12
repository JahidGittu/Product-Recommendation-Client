import React, { useEffect, useState } from 'react';
import Banner from '../Shared/Components/Banner';
import Hero from '../Shared/Components/Hero';
import RecentQueries from '../Shared/Components/RecentQueries';
import axios from 'axios';
import FeaturedRecommendations from '../Shared/Components/FeaturedRecommendations';
import TopRatedProducts from '../Shared/Components/TopRatedProducts';
import Reviews from '../Shared/Components/Reviews';

const Home = () => {


    // এটা হলো স্লাইড বেনার সেকশন
    const [sliderData, setSliderData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const res = await fetch('http://localhost:5000/queries-with-recommendations');
                const data = await res.json();

                const combined = data.queries.map(query => {
                    const recs = data.recommendationsByQuery?.[query._id] || [];
                    const bestRec = recs
                        .slice()
                        .sort((a, b) => {
                            const aScore = (a.likes?.length || 0) + (a.comments?.length || 0);
                            const bScore = (b.likes?.length || 0) + (b.comments?.length || 0);
                            return bScore - aScore;
                        })
                        .find(rec => (rec.likes?.length || 0) > 0 || (rec.comments?.length || 0) > 0)
                        || recs[recs.length - 1] || null;

                    return {
                        id: query._id,
                        queryTitle: query.queryTitle,
                        queryImage: query.queryImage || query.productImage || '',
                        productName: query.productName,
                        boycottReason: query.boycottReason,
                        productImage: query.productImage,
                        recommendation: bestRec ? {
                            productName: bestRec.productName,
                            productImage: bestRec.productImage,
                            recommenderName: bestRec.recommenderName,
                            recommenderPhoto: bestRec.recommenderPhoto,
                            likesCount: bestRec.likes?.length || 0,
                            commentsCount: bestRec.comments?.length || 0,
                            shortReason: bestRec.recommendationReason?.slice(0, 60) +
                                (bestRec.recommendationReason?.length > 60 ? '...' : ''),
                        } : null,
                    };
                });

                setSliderData(combined);
            } catch (err) {
                console.error('Failed to fetch slider data:', err);
            }
        };

        fetchSliderData();
    }, []);



    // এটা হলো ফিচার রিকোমেন্ডেশন সেকশন 

    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchFeaturedRecommendations = async () => {
            try {
                const res = await axios.get('http://localhost:5000/recommendations/featured');
                setRecommendations(res.data);
            } catch (err) {
                console.error('Failed to load featured recommendations', err);
            }
        };
        fetchFeaturedRecommendations();
    }, []);



    // এটা হলো টপ রেটেড প্রডাক্ট এর সেকশণ

    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                const res = await axios.get('http://localhost:5000/recommendations/top-rated');
                setTopProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTopRated();
    }, []);

    return (
        <div>
            <header >
                <Hero></Hero>
            </header>
            <main>
                <section className='my-24'>
                    <Banner sliderData={sliderData} activeIndex={activeIndex} setActiveIndex={setActiveIndex}></Banner>
                </section>

                <section>
                    <RecentQueries></RecentQueries>
                </section>

                <section>
                    <FeaturedRecommendations recommendations={recommendations}></FeaturedRecommendations>
                </section>

                <section>
                    <TopRatedProducts topProducts={topProducts}></TopRatedProducts>
                </section>

                <section>
                    <Reviews></Reviews>
                </section>
            </main>
        </div>
    );
};

export default Home;