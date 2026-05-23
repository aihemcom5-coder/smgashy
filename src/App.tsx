/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Home, FolderKanban, Settings, Bell, Search, User } from 'lucide-react';

const activeProjects = [
  { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, lastUpdated: '2 hours ago' },
  { id: 2, name: 'Q3 Marketing Campaign', status: 'Planning', progress: 20, lastUpdated: '5 days ago' },
  { id: 3, name: 'Mobile App Launch', status: 'Review', progress: 90, lastUpdated: '1 day ago' },
  { id: 4, name: 'API Integration', status: 'In Progress', progress: 45, lastUpdated: '3 hours ago' },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold font-sans text-gray-900 tracking-tight">Workspace</span>
          <button onClick={toggleSidebar} className="p-1 text-gray-500 hover:text-gray-700 lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg">
            <Home className="w-5 h-5 mr-3 text-blue-700" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <FolderKanban className="w-5 h-5 mr-3 text-gray-400" />
            Projects
          </a>
          <a href="#" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3 text-gray-400" />
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center flex-1">
              <button 
                onClick={toggleSidebar} 
                className="p-2 -ml-2 mr-2 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative hidden sm:block max-w-xs w-full lg:max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-gray-200 hover:bg-gray-300 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">Active Projects</h1>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block text-center shadow-sm">
                New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{project.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      project.status === 'Planning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.progress >= 90 ? 'bg-green-500' :
                            project.progress <= 30 ? 'bg-amber-500' :
                            'bg-blue-600'
                          }`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span>Updated {project.lastUpdated}</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-600"/>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800"><span className="font-medium text-gray-900">Sarah Jenkins</span> commented on <span className="font-medium text-blue-600 cursor-pointer hover:underline">Website Redesign</span></p>
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-4 h-4 text-green-600"/>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800"><span className="font-medium text-gray-900">Mark Rivera</span> moved <span className="font-medium text-blue-600 cursor-pointer hover:underline">Mobile App Launch</span> to Review</p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
