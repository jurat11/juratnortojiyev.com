import { useState, useEffect, useRef } from 'react';
import { supabase, Experience, Project } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Lock, User, Move } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'experiences' | 'projects' | 'blogs'>('experiences');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ id: number; type: 'experience' | 'project' } | null>(null);

  // Form states
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  // Experience form
  const [experienceForm, setExperienceForm] = useState({
    period: '',
    company: '',
    job_title: '',
    description: '',
    link: '',
    display_order: 0
  });

  // Project form
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    skills: '',
    github: '',
    live: '',
    display_order: 0
  });

  // Blog form
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'Jurat Nortojiev',
    read_time: ''
  });
  
  // Function to update editor content from contentEditable div
  const updateEditorContent = () => {
    const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement;
    if (editor && textarea) {
      const htmlContent = editor.innerHTML;
      setBlogForm(prev => ({ ...prev, content: htmlContent }));
      textarea.value = htmlContent;
    }
  };
  
  // Sync editor content when blogForm.content changes externally (e.g., when editing or resetting)
  useEffect(() => {
    const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
    if (editor && showBlogForm) {
      // Only update if content is different and editor is empty or content was reset
      const currentContent = editor.innerHTML.trim();
      const formContent = blogForm.content || '';
      if (currentContent !== formContent && (currentContent === '' || formContent === '')) {
        editor.innerHTML = formContent;
      }
    }
  }, [showBlogForm, editingBlog, blogForm.content]);

  // File upload refs
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Check credentials
    if (loginForm.username === 'Jurat' && loginForm.password === '10Jurat10') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      fetchData();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setLoginForm({ username: '', password: '' });
  };

  // Fetch data on component mount
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Fetching data from Supabase...');

      // Fetch experiences
      const { data: expData, error: expError } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      console.log('📊 Experiences response:', { data: expData, error: expError });

      if (expError) throw expError;

      // Fetch projects
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      console.log('📊 Projects response:', { data: projData, error: projError });

      if (projError) throw projError;

      // Fetch blogs
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

      console.log('📊 Blogs response:', { data: blogData, error: blogError });

      if (blogError) throw blogError;

      setExperiences(expData || []);
      setProjects(projData || []);
      setBlogs(blogData || []);
      
      console.log('✅ Data loaded successfully');
      console.log('📝 Experiences count:', expData?.length || 0);
      console.log('🚀 Projects count:', projData?.length || 0);
      console.log('📝 Blogs count:', blogData?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Image upload function
  const handleImageUpload = async (file: File, formType: 'project' | 'blog' = 'project') => {
    try {
      setUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPEG, PNG, GIF, etc.)');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image file size must be less than 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      console.log('📤 Uploading image to Supabase Storage...');

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      console.log('✅ Image uploaded successfully:', publicUrl);

      // Update the appropriate form with the uploaded image URL
      if (formType === 'project') {
        setProjectForm(prev => ({ ...prev, image: publicUrl }));
      } else if (formType === 'blog') {
        setBlogForm(prev => ({ ...prev, image: publicUrl }));
      }

      // Show success message
      setError(null);
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      setError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change for projects
  const handleProjectFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, 'project');
    }
  };

  // Handle file input change for blogs
  const handleBlogFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, 'blog');
    }
  };

  // Trigger file input for projects
  const triggerProjectFileUpload = () => {
    projectFileInputRef.current?.click();
  };

  // Trigger file input for blogs
  const triggerBlogFileUpload = () => {
    blogFileInputRef.current?.click();
  };

  // Experience functions
  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('💾 Saving experience:', experienceForm);
      
      if (editingExperience) {
        // Update existing experience
        const { error } = await supabase
          .from('experiences')
          .update(experienceForm)
          .eq('id', editingExperience.id);

        if (error) throw error;
        console.log('✅ Experience updated successfully');
      } else {
        // Create new experience
        const { error } = await supabase
          .from('experiences')
          .insert([experienceForm]);

        if (error) throw error;
        console.log('✅ Experience created successfully');
      }

      // Reset form and refresh data
      setShowExperienceForm(false);
      setEditingExperience(null);
      setExperienceForm({ period: '', company: '', job_title: '', description: '', link: '', display_order: 0 });
      fetchData();
    } catch (error) {
      console.error('❌ Error saving experience:', error);
      setError(`Failed to save experience: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setExperienceForm({
      period: experience.period,
      company: experience.company,
      job_title: experience.job_title,
      description: experience.description || '',
      link: experience.link || '',
      display_order: experience.display_order || 0
    });
    setShowExperienceForm(true);
  };

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      console.log('🗑️ Deleting experience:', id);
      
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Experience deleted successfully');
      fetchData();
    } catch (error) {
      console.error('❌ Error deleting experience:', error);
      setError(`Failed to delete experience: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Project functions
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('💾 Saving project:', projectForm);
      
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectForm)
          .eq('id', editingProject.id);

        if (error) throw error;
        console.log('✅ Project updated successfully');
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([projectForm]);

        if (error) throw error;
        console.log('✅ Project created successfully');
      }

      // Reset form and refresh data
      setShowProjectForm(false);
      setEditingProject(null);
      setProjectForm({ title: '', description: '', image: '', skills: '', github: '', live: '', display_order: 0 });
      fetchData();
    } catch (error) {
      console.error('❌ Error saving project:', error);
      setError(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image,
      skills: project.skills,
      github: project.github || '',
      live: project.live || '',
      display_order: project.display_order || 0
    });
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      console.log('🗑️ Deleting project:', id);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Project deleted successfully');
      fetchData();
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      setError(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Blog functions
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('💾 Saving blog:', blogForm);
      
      if (editingBlog) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogForm)
          .eq('id', editingBlog.id);

        if (error) throw error;
        console.log('✅ Blog updated successfully');
      } else {
        // Create new blog
        const { error } = await supabase
          .from('blogs')
          .insert([blogForm]);

        if (error) throw error;
        console.log('✅ Blog created successfully');
      }

      // Reset form and refresh data
      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'Jurat Nortojiev', read_time: '' });
      fetchData();
    } catch (error) {
      console.error('❌ Error saving blog:', error);
      setError(`Failed to save blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image || '',
      author: blog.author || 'Jurat Nortojiev',
      read_time: blog.read_time || ''
    });
    setShowBlogForm(true);
    // Update editor content after form is set
    setTimeout(() => {
      const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
      if (editor) {
        editor.innerHTML = blog.content || '';
      }
    }, 100);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      console.log('🗑️ Deleting blog:', id);
      
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Blog deleted successfully');
      fetchData();
    } catch (error) {
      console.error('❌ Error deleting blog:', error);
      setError(`Failed to delete blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };


  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, id: number, type: 'experience' | 'project') => {
    setDraggedItem({ id, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: number, type: 'experience' | 'project') => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.type !== type || draggedItem.id === targetId) {
      return;
    }

    try {
      const items = type === 'experience' ? experiences : projects;
      const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
      const targetIndex = items.findIndex(item => item.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return;

      // Calculate new order
      const newOrder = [...items];
      const [draggedItemData] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItemData);

      // Update display_order for all items
      const updates = newOrder.map((item, index) => ({
        id: item.id,
        display_order: index
      }));

      // Update in database
      const { error } = await supabase
        .from(type === 'experience' ? 'experiences' : 'projects')
        .upsert(updates);

      if (error) throw error;

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error reordering items:', error);
      setError(`Failed to reorder ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold" style={{ color: '#A0332B' }}>
              Admin Panel
            </h1>
            <p className="mt-2 text-gray-600">Sign in to access the admin panel</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{loginError}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: '#A0332B' }}
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <a href="/" className="text-red hover:text-red-dark text-sm transition-colors">
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file inputs */}
      <input
        ref={projectFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProjectFileChange}
        className="hidden"
      />
      <input
        ref={blogFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBlogFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold" style={{ color: '#A0332B' }}>
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-red hover:text-red-dark transition-colors">
                ← Back to Website
              </a>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'experiences'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Experiences ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'blogs'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blogs ({blogs.length})
          </button>
        </div>

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Experiences</h2>
                <p className="text-sm text-gray-600 mt-1">Drag items to reorder them on the main website</p>
              </div>
              <button
                onClick={() => {
                  setShowExperienceForm(true);
                  setEditingExperience(null);
                  setExperienceForm({ period: '', company: '', job_title: '', description: '', link: '', display_order: 0 });
                }}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#A0332B' }}
              >
                <Plus size={16} />
                Add Experience
              </button>
            </div>

            {/* Experience Form */}
            {showExperienceForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </h3>
                <form onSubmit={handleExperienceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
                      <input
                        type="text"
                        value={experienceForm.period}
                        onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                        placeholder="e.g., 2023 - Present"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                      <input
                        type="text"
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                        placeholder="Company name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={experienceForm.job_title}
                      onChange={(e) => setExperienceForm({ ...experienceForm, job_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Job title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Job description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Link</label>
                    <input
                      type="url"
                      value={experienceForm.link}
                      onChange={(e) => setExperienceForm({ ...experienceForm, link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="https://company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={experienceForm.display_order}
                      onChange={(e) => setExperienceForm({ ...experienceForm, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                      style={{ backgroundColor: '#A0332B' }}
                    >
                      <Save size={16} />
                      {editingExperience ? 'Update' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowExperienceForm(false);
                        setEditingExperience(null);
                        setExperienceForm({ period: '', company: '', job_title: '', description: '', link: '', display_order: 0 });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Experiences List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {experiences.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No experiences found. Add your first experience above.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {experiences.map((experience) => (
                    <div 
                      key={experience.id} 
                      className={`p-6 hover:bg-gray-50 transition-colors ${
                        draggedItem?.id === experience.id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, experience.id, 'experience')}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, experience.id, 'experience')}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{experience.job_title}</h3>
                          <p className="font-medium" style={{ color: '#A0332B' }}>{experience.company}</p>
                          <p className="text-sm text-gray-500 mb-2">{experience.period}</p>
                          {experience.description && (
                            <p className="text-gray-700 text-sm">{experience.description}</p>
                          )}
                          {experience.link && (
                            <a
                              href={experience.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red hover:text-red-dark text-sm inline-flex items-center gap-1"
                            >
                              View Company →
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-move"
                            title="Drag to reorder"
                          >
                            <Move size={16} />
                          </button>
                          <button
                            onClick={() => handleEditExperience(experience)}
                            className="p-2 rounded-lg hover:bg-red/10 transition-colors"
                            style={{ color: '#A0332B' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#8B2A23'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#A0332B'}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(experience.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="text-sm text-gray-600 mt-1">Drag items to reorder them on the main website</p>
              </div>
              <button
                onClick={() => {
                  setShowProjectForm(true);
                  setEditingProject(null);
                  setProjectForm({ title: '', description: '', image: '', skills: '', github: '', live: '', display_order: 0 });
                }}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#A0332B' }}
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            {/* Project Form */}
            {showProjectForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Project title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Project description"
                      required
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Image *</label>
                    <div className="space-y-3">
                      {/* Current Image Preview */}
                      {projectForm.image && (
                        <div className="relative">
                          <img
                            src={projectForm.image}
                            alt="Project preview"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setProjectForm(prev => ({ ...prev, image: '' }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      
                      {/* Upload Options */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={triggerProjectFileUpload}
                          disabled={uploading}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Upload size={16} />
                          {uploading ? 'Uploading...' : 'Upload from Device'}
                        </button>
                        
                        <span className="text-sm text-gray-500 self-center">or</span>
                        
                        <input
                          type="url"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                          placeholder="Enter image URL"
                        />
                      </div>
                      
                      {/* Upload Status */}
                      {uploading && (
                        <div className="flex items-center gap-2" style={{ color: '#A0332B' }}>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red"></div>
                          <span className="text-sm">Uploading image...</span>
                        </div>
                      )}
                      
                      {/* File Requirements */}
                      <div className="text-xs text-gray-500">
                        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                        <p>• Maximum file size: 5MB</p>
                        <p>• Images will be stored securely in Supabase Storage</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                    <input
                      type="text"
                      value={projectForm.skills}
                      onChange={(e) => setProjectForm({ ...projectForm, skills: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="e.g., React, TypeScript, CSS"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link</label>
                      <input
                        type="url"
                        value={projectForm.github}
                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo Link</label>
                      <input
                        type="url"
                        value={projectForm.live}
                        onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                        placeholder="https://demo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={projectForm.display_order}
                      onChange={(e) => setProjectForm({ ...projectForm, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                      style={{ backgroundColor: '#A0332B' }}
                    >
                      <Save size={16} />
                      {editingProject ? 'Update' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                        setProjectForm({ title: '', description: '', image: '', skills: '', github: '', live: '', display_order: 0 });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Projects List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {projects.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No projects found. Add your first project above.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className={`p-6 hover:bg-gray-50 transition-colors ${
                        draggedItem?.id === project.id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id, 'project')}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, project.id, 'project')}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                          
                          {/* Project Image Preview */}
                          {project.image && (
                            <div className="mb-3">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-24 h-18 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.skills.split(',').map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: '#A0332B', color: '#FFFFFF' }}
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-4 text-sm">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red hover:text-red-dark inline-flex items-center gap-1"
                              >
                                GitHub →
                              </a>
                            )}
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red hover:text-red-dark inline-flex items-center gap-1"
                              >
                                Live Demo →
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-move"
                            title="Drag to reorder"
                          >
                            <Move size={16} />
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="p-2 rounded-lg hover:bg-red/10 transition-colors"
                            style={{ color: '#A0332B' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#8B2A23'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#A0332B'}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
              <button
                onClick={() => {
                  setShowBlogForm(true);
                  setEditingBlog(null);
                  setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'Jurat Nortojiev', read_time: '' });
                  // Clear editor content
                  setTimeout(() => {
                    const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
                    if (editor) {
                      editor.innerHTML = '';
                    }
                  }, 100);
                }}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#A0332B' }}
              >
                <Plus size={16} />
                Add Blog Post
              </button>
            </div>

            {/* Blog Form */}
            {showBlogForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h3>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Blog post title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Optional)</label>
                    <textarea
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Brief summary of the blog post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    
                    {/* Text Editor Toolbar */}
                    <div className="flex gap-2 mb-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
                      <button
                        type="button"
                        onClick={() => {
                          const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
                          if (editor) {
                            document.execCommand('bold', false);
                            updateEditorContent();
                          }
                        }}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors font-bold"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
                          if (editor) {
                            document.execCommand('italic', false);
                            updateEditorContent();
                          }
                        }}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors italic"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
                          if (editor) {
                            document.execCommand('underline', false);
                            updateEditorContent();
                          }
                        }}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors underline"
                        title="Underline"
                      >
                        U
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter URL:', 'https://');
                          if (url) {
                            const editor = document.getElementById('blog-content-editor') as HTMLDivElement;
                            if (editor) {
                              const selection = window.getSelection();
                              if (selection && selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                const link = document.createElement('a');
                                link.href = url;
                                link.textContent = selection.toString() || url;
                                link.target = '_blank';
                                range.deleteContents();
                                range.insertNode(link);
                                updateEditorContent();
                              }
                            }
                          }
                        }}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                        title="Insert Link"
                      >
                        🔗
                      </button>
                    </div>
                    
                    {/* WYSIWYG Editor */}
                    <div
                      id="blog-content-editor"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={updateEditorContent}
                      onBlur={updateEditorContent}
                      className="w-full min-h-[200px] px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900"
                      style={{ 
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        fontFamily: 'EB Garamond, serif'
                      }}
                    />
                    
                    {/* Hidden textarea for form submission */}
                    <textarea
                      id="blog-content-textarea"
                      value={blogForm.content}
                      onChange={() => {}}
                      className="hidden"
                      required
                    />
                    
                    <p className="text-xs text-gray-500 mt-1">Select text and use toolbar buttons to format. Changes appear in real-time.</p>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image (Optional)</label>
                    <div className="space-y-3">
                      {/* Current Image Preview */}
                      {blogForm.image && (
                        <div className="relative">
                          <img
                            src={blogForm.image}
                            alt="Blog preview"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setBlogForm(prev => ({ ...prev, image: '' }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      
                      {/* Pre-uploaded Photos Selection */}
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Choose from pre-uploaded photos:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {['website photo.jpg', 'website photo 1.jpg', 'website photo 2.jpg', 'website photo 3.jpg', 'website photo 4.jpg', 'website photo 5.jpg', 'website photo 6.jpg'].map((photoName) => {
                            const photoPath = `/uploads/${photoName}`;
                            const isSelected = blogForm.image === photoPath;
                            return (
                              <button
                                key={photoName}
                                type="button"
                                onClick={() => setBlogForm(prev => ({ ...prev, image: photoPath }))}
                                className={`relative aspect-video border-2 rounded-lg overflow-hidden transition-all ${
                                  isSelected
                                    ? 'border-red-500 ring-2 ring-red-200' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <img
                                  src={photoPath}
                                  alt={photoName}
                                  className="w-full h-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Upload Options - Only show if no pre-uploaded photo is selected */}
                      {!blogForm.image || !blogForm.image.startsWith('/uploads/website photo') ? (
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={triggerBlogFileUpload}
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <Upload size={16} />
                            {uploading ? 'Uploading...' : 'Upload from Device'}
                          </button>
                          
                          <div>
                            <p className="text-xs text-gray-600 mb-2">Or enter custom image URL:</p>
                            <input
                              type="url"
                              value={blogForm.image}
                              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                              placeholder="Enter image URL"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 mt-2">
                          Selected: {blogForm.image.split('/').pop()}
                        </div>
                      )}
                      
                      {/* Upload Status */}
                      {uploading && (
                        <div className="flex gap-2" style={{ color: '#A0332B' }}>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red"></div>
                          <span className="text-sm">Uploading image...</span>
                        </div>
                      )}
                      
                      {/* File Requirements */}
                      <div className="text-xs text-gray-500">
                        <p>• Images are optional but recommended for better engagement</p>
                        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                        <p>• Maximum file size: 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (Optional)</label>
                    <input
                      type="text"
                      value={blogForm.read_time}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red focus:border-red text-gray-900 placeholder-gray-500"
                      placeholder="e.g., 5 min read, 10 min read"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to auto-calculate based on content length
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Save size={16} />
                      {editingBlog ? 'Update' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlogForm(false);
                        setEditingBlog(null);
                        setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'Nortojiyev Jur\'at', read_time: '' });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Blogs List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {blogs.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No blog posts found. Add your first blog post above.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                          <p className="text-gray-700 text-sm mb-3">{blog.excerpt}</p>
                          
                          {/* Blog Image Preview */}
                          {blog.image && (
                            <div className="mb-3">
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-24 h-18 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>By: {blog.author}</span>
                            <span>Published: {new Date(blog.published_at).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Content length: {blog.content.length} characters</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
