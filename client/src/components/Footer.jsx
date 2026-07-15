import React from 'react'
import { assets } from '../assets/assets'
import { Clapperboard, Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
  <footer className="relative mt-20 pt-16 bg-gray-900/40 backdrop-blur-lg border-t border-gray-800 text-gray-300 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            
            <div className="px-6 md:px-16 lg:px-36 w-full pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* Brand & Description */}
                    <div className="lg:col-span-4">
                        <div className='flex items-center gap-2 group cursor-pointer w-max mb-6'>
                            <div className="bg-primary p-2 rounded-lg group-hover:bg-primary-dull transition-colors duration-300 shadow-[0_0_15px_rgba(52,93,83,0.5)]">
                                <Clapperboard className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                ShowTime
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
                            Experience the magic of cinema. Book tickets, explore upcoming releases, and discover the best theaters near you with our seamless platform.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"><Youtube className="w-4 h-4" /></a>
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h2 className="text-white font-semibold mb-5 text-lg">Company</h2>
                        <ul className="text-sm space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Home</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3"/> About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Contact</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Privacy Policy</a></li>
                        </ul>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h2 className="text-white font-semibold mb-5 text-lg">Contact</h2>
                        <ul className="text-sm space-y-3 text-gray-400">
                            <li>+91 98765 43210</li>
                            <li>contact@showtime.in</li>
                            <li>Bhimavaram, <br/>Andhra Pradesh, India</li>
                        </ul>
                    </div>

                    {/* Newsletter & Apps */}
                    <div className="lg:col-span-4">
                        <h2 className="text-white font-semibold mb-5 text-lg">Subscribe to Newsletter</h2>
                        <p className="text-sm text-gray-400 mb-4">Get the latest updates on movie releases and exclusive offers.</p>
                        
                        <div className="flex items-center bg-gray-800 p-1 rounded-full mb-6 border border-gray-700 focus-within:border-primary transition-colors">
                            <Mail className="w-5 h-5 text-gray-400 ml-3" />
                            <input type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none text-sm px-3 py-2 w-full text-white" />
                            <button className="bg-primary hover:bg-primary-dull text-white text-sm font-medium px-5 py-2 rounded-full transition-colors duration-300">
                                Subscribe
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <img src={assets.googlePlay} alt="Google Play" className="h-9 w-auto hover:opacity-80 transition-opacity cursor-pointer" />
                            <img src={assets.appStore} alt="App Store" className="h-9 w-auto hover:opacity-80 transition-opacity cursor-pointer" />
                        </div>
                    </div>
                    
                </div>
            </div>
            
            {/* Copyright */}
            <div className="w-full bg-black/40 py-5 border-t border-gray-800/50">
                <p className="text-center text-sm text-gray-500">
                    Copyright {new Date().getFullYear()} © <a href="https://prebuiltui.com" className="text-primary hover:underline">ShowTime</a>. All Rights Reserved.
                </p>
            </div>
        </footer>
  )
}

export default Footer