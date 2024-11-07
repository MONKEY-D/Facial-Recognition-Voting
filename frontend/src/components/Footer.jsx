import React from "react";
import { Footer, FooterDivider } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsInstagram , BsTwitter , BsGithub } from 'react-icons/bs'

export default function FooterCom() {
  return (
    <Footer container className="border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auo">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-green-500 via-green-500 to-blue-500 rounded-lg text-white">
                Let's
              </span>
              Vote
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href=""
                  target=""
                  rel=""
                >
                  My Resume
                </Footer.Link>
                <Footer.Link
                  href=""
                  target=""
                  rel=""
                >
                  Portfolio
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Me" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href=""
                  target=""
                  rel=""
                >
                  Instagram
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/kartik-verma-4b99012b8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href=""
                  target=""
                  rel=""
                >
                  Priivacy Policy
                </Footer.Link>
                <Footer.Link
                  href=""
                  target=""
                  rel=""
                >
                  Terma & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href='#' by="By Kartik Verma" year={new Date().getFullYear()}/>
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                <Footer.Icon href="#" icon={BsInstagram}/>
                <Footer.Icon href="#" icon={BsTwitter}/>
                <Footer.Icon href="#" icon={BsGithub}/>
            </div>
        </div>
      </div>
    </Footer>
  );
}
