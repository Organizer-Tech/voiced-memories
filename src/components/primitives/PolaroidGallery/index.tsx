'use client'

import React from 'react';
import Link from 'next/link';

const PolaroidGallery = ({ buttons, textSize }) => {
  
  return (
    <div className={`font-custom  bg-cover bg-repeat text-black p-4 ${textSize}`}>
      <ul className="absolute m-0 p-0">
        {buttons.map((button, index) => (
          <li
            key={index}
            className={`text-center inline-block list-none relative border-12 border-white bg-white shadow-lg transition-all duration-1000 ease-in-out ${button.className}`}
            style={{ top: '30px' }}
            onMouseOver={(e) => (e.currentTarget.style.top = '0px')}
            onMouseOut={(e) => (e.currentTarget.style.top = '30px')}
          >
            <Link href={button.link} passHref legacyBehavior>
              <a>
                {button.imgURL ? (
                  <img src={button.imgURL} width={button.size} alt={`image #${index + 1}`} />
                ) : (
                  <img src={`https://unsplash.it/${button.imageSize}/${button.imageSize}`} width={button.size} alt={`image #${index + 1}`} />
                )}
                <p className="m-0">{button.name}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div className="light"></div>
      <style jsx global>{`
        .font-custom {
          font-family: 'Homemade Apple', cursive;
        }
        .rotate-10 {
          transform: rotate(10deg);
        }
        .rotate-20 {
          transform: rotate(20deg);
        }
        .rotate-0 {
          transform: rotate(0deg);
        }
        .-rotate-10 {
          transform: rotate(-10deg);
        }
        .shadow-lg {
          box-shadow: 0 0 15px 0px #555;
        }
        .light {
          border-radius: 50%;
          position: absolute;
          left: 0;
          right: 0;
          width: 700px;
          height: 700px;
          background: #fff;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PolaroidGallery;
