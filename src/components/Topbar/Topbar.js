import React, { Component } from 'react';

class Topbar extends Component {
  render() {
    return (
      <div class="relative bg-white shadow">
        <div class="max-w-full mx-auto px-4 sm:px-6">
          <div class="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div class="w-0 flex-1 flex">
              <a href="#" class="inline-flex">
                <img class="h-8 w-auto sm:h-10" src="/indielog-logo.png" alt="Workflow" />
              </a>
            </div>

            <div class=" md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
              <a
                href="#"
                class="whitespace-no-wrap text-base leading-6 font-medium text-gray-500 hover:text-gray-900 transition ease-in-out duration-150"
              >
                Sign in
              </a>
              <span class="inline-flex rounded-md shadow-sm">
                <a
                  href="#"
                  class="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 hover:text-white focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                >
                  Sign up
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
