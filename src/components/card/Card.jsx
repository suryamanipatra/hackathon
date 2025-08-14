import React from 'react'

const Card = ({ icon, title, description }) => {
    return (
        <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '320px',
            margin: 'auto',
            textAlign: 'center'
        }}>
            {icon && (
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
            )}
            <h3 style={{
                textAlign: 'center',
                margin: '1rem 0',
                fontFamily: 'sans-serif',
                fontWeight: 'semi-bold',
                fontSize: '16px',
                lineHeight: '120%',
                letterSpacing: '0px',
                color: '#000000'
            }}>
                {title}
            </h3>
            <p style={{
                textAlign: 'center',
                margin: '0.5rem 0',
                fontWeight: 400, 
                fontSize: '16px',
                lineHeight: '120%', 
                letterSpacing: '0px',
                color: '#',
                
            }}>
                {description}
            </p>

        </div>

    )
}

export default Card