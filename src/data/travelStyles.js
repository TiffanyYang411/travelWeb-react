// src/data/travelStyles.js

const baseUrl = import.meta.env.BASE_URL;

export const travelStyles = [
  {
    id: 1, // 新增
    title: '極致戶外探險',
    description: '適合挑戰極限、親近大自然的人，深入北歐荒野，探索極端環境的壯麗風景',
    background: `${baseUrl}images/outdoor-bg.jpg`,
    thumbnail: `${baseUrl}images/outdoor-thumb.jpg`,
    exploreImage: `${baseUrl}images/explore-outdoor.jpg`, // ✅ ExploreStyle 專用
  },
  {
    id: 2, // 新增
    title: '米其林美食巡禮',
    description: '精選北歐頂級米其林星級餐廳，體驗當地新北歐料理，品味極致美食與高端用餐環境',
    background: `${baseUrl}images/gourmet-bg.jpg`,
    thumbnail: `${baseUrl}images/gourmet-thumb.jpg`,
    exploreImage: `${baseUrl}images/explore-gourmet.jpg`, // ✅ ExploreStyle 專用
  },
  {
    id: 3, // 新增
    title: '頂級奢華度假',
    description: '專屬高端人士的休閒度假行程，結合高端住宿、私人管家、獨特體驗，提供極致放鬆享受',
    background: `${baseUrl}images/luxury-bg.jpg`,
    thumbnail: `${baseUrl}images/luxury-thumb.jpg`,
    exploreImage: `${baseUrl}images/explore-luxury.jpg`, // ✅ ExploreStyle 專用
  },
  {
    id: 4, // 新增
    title: '深度文化之旅',
    description: '探索北歐的歷史文化，體驗當地傳統，深入當地人的生活方式',
    background: `${baseUrl}images/culture-bg.jpg`,
    thumbnail: `${baseUrl}images/culture-thumb.jpg`,
    exploreImage: `${baseUrl}images/explore-culture.jpg`, // ✅ ExploreStyle 專用
  },
  {
    id: 5, // 新增
    title: '北歐療癒假期',
    description: '專為身心靈療癒設計的行程，結合北歐極簡主義、自然療法與頂級水療',
    background: `${baseUrl}images/healing-bg.jpg`,
    thumbnail: `${baseUrl}images/healing-thumb.jpg`,
    exploreImage: `${baseUrl}images/explore-healing.jpg`, // ✅ ExploreStyle 專用
  },
];


