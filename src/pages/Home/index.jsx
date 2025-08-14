import React from 'react'
import Card from '../../components/card/Card'
import './index.css'
import SearchAppBar from '../../components/searchbar';

const Index = () => {
  const cardsData = [
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },
    {
      icon: <img src="" />,
      title: "Data Aggregation",
      description: "Collects and unifies information from trusted public and private sources like Yahoo Finance, BSE, NSE, data.gov.in, LinkedIn, and more."
    },

  ];

  return (
    <>
      <div style={{
        backgroundColor: 'lightblue',
        height: '60vh',
        width: '100%',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}>
          <SearchAppBar />
        </div>
      </div>
      <p style={{
        textAlign: 'center',
        margin: '1rem 0',
        fontFamily: '"Your Actual Font Name", sans-serif',
        fontWeight: 'bold',
        fontSize: '36px',
        lineHeight: '120%',
        letterSpacing: '0px',
        color: '#000000'
      }}>
        9D: AI-Powered Multi-Dimensional Company Intelligence
      </p>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {cardsData.slice(0, 3).map((card, index) => (
            <Card
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {cardsData.slice(3, 6).map((card, index) => (
            <Card
              key={index + 3}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <Card
            icon={cardsData[6].icon}
            title={cardsData[6].title}
            description={cardsData[6].description}
          />
        </div>
      </div>
    </>
  )
}

export default Index