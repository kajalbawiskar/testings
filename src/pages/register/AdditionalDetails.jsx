/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const AdditionalDetails = () => {
  const categories = [
    'Animals & Pets',
    'Advocacy',
    'Arts & Entertainment',
    'Attorneys & Legal Services',
    'Automotive',
    'Beauty & Personal Care',
    'Business Services',
    'Dating & Personals',
    'Dentists & Dental Services',
    'Education & Instruction',
    'Finance & Insurance',
    'Home & Home Improvement',
    'Furniture',
    'Health & Fitness',
    'Health & Medical',
    'Home Goods',
    'E-Commerce',
    'Real Estate',
  ];

  const [category, setCategory] = useState();
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const animals_pets = ['Pet Shop', 'Pet Grooming', 'Pet Food'];
  const advocacy = [
    'Case advocacy',
    'Peer advocacy',
    'Paid independent advocacy',
    'Citizen advocacy',
    'Statutory advocacy',
  ];
  const art_ent = [
    'Amusement parks',
    'Music',
    'Performance art',
    'Publicist',
    'Sports',
    'Artist manager',
    'Media',
    'Bounce house',
    'Casino',
    'Comedy Club',
    'Costume designer',
    'Dance studio',
    'Dinner Theatre',
    'D j',
    'Museums',
    'Promoter',
    'Ad film production',
    'Agents and agencies',
    'Animation',
    'Art Gallery',
    'Attractions',
    'Entertainment venues',
  ];

  const autom = [
    'Auto restoration',
    'Car dealership',
    'Car rental services',
    'Car wash',
    'Auto Accessories store',
    'Bus services',
    'Car detailing',
    'Spare parts',
    'Auto body repair shops',
    'Auto instructor',
    'Automobile Magazine',
    'Oil change',
    'Charging station',
    'Towing',
    'Auto locksmith business',
    'Automobile insurance',
    'Battery store',
    'Car service',
    'Hauling business',
    'Limo business',
  ];
  const attorneys = [
    'Contract lawyer',
    'Immigration lawyer',
    'Intellectual property lawyer',
    'Tax lawyer',
    'Family law',
    'Personal injury lawyer',
    'Prosecutor',
    'Bankruptcy Lawyer',
    'Entertainment lawyer',
    'Real estate lawyer',
    'Technology lawyer',
  ];
  const beauty = [
    'Skin care',
    'Decorative cosmetics',
    'Hair care',
    'Beauty products',
    'Oral Care',
    'Beauty product business',
    'Makeup artist',
    'Nail salon',
    'Perfumes',
    'Start a beauty school',
    'Start a spa business',
  ];
  const business = [
    'Management Consultant',
    'Financial Analyst',
    'Finance',
    'Sales',
    'Marketing',
    'Sales Management',
    'Accounting',
    'Event management',
    'Accountant',
    'Software Engineer',
    'Management Analyst',
    'Real Estate',
    'Construction',
    'Actuary',
    'Financial adviser',
    'Business Analyst',
    'Business consultant',
    'Auditor',
    'Office administration',
    'Chief Executive Officer',
  ];
  const dating = ['Online dating App', 'Online Dating website', 'Wedding Planners'];

  const dentists = [
    'Endodontic procedures',
    'Pediatric dental services',
    'Periodontal treatments',
    'Diagnostic and preventative dental services',
    'Prosthodontic services',
    'Oral and maxillofacial surgery',
  ];
  const edu = [
    'Tutoring',
    'Online private/ charter school',
    'Online courses',
    'Lesson plans/material',
    'Homeschooling',
    'Teaching languages',
    'Test prep coaching',
    'Mindfulness or stress management',
  ];
  const finance = [
    'Commercial auto insurance',
    'Commercial property insurance',
    'General liability insurance',
    'Data breach insurance',
    "Workers' compensation insurance",
    'Business income insurance',
    'Commercial umbrella insurance',
    'Liability insurance',
    'Business interruption insurance',
    "Business owner's policy",
  ];

  const home_improve = [
    'Basement remodeling',
    'Lawn care',
    'Plumbing',
    'Electrical',
    'Furniture assembly',
    'Apartment cleaning',
    'Carpentry',
    'Deck building',
    'Flooring',
    'Handyman services',
    'Home security business',
    'House painter',
    'Carpeting',
    'Fence installation and repair',
    'Wallpapering',
    'Home maintenance and repair services',
    'Home automation Technician',
    'Tiling',
  ];
  const furniture = [
    'Furniture stores',
    'Interior design services',
    'Furniture repair shops',
    'Furniture Manufacturing',
    'Furniture distribution',
    'Specializing in specific types of furniture',
    'Reupholstery shop',
  ];

  const health = [
    'Yoga',
    'Bootcamp Fitness',
    'Nutrition',
    'Personal training',
    'Branded fitness apparel',
    'Meditation',
    'Pilates',
    'CrossFit',
    'Dance studio',
    'Boutique gym',
    'Fitness equipment',
    'Fitness vlogger',
    'Mobile fitness studio',
    'Outdoor classes',
    'Personalized wellness',
    'Physical therapist',
    'Powerlifting gym',
    'Zumba',
    'Bike tour',
    'Fitness affiliate',
    'Fitness Director',
    'Fitness franchise',
    'Gymnastics classes business',
  ];

  const health_medical = [
    'Methadone clinic',
    'Healthcare facilities',
    'Medical billing service',
    'Medical records management',
    'Transcribing services',
    'Mobile Medical screening',
    'Nutrition consultation',
    'Pharmaceutical',
    'Childbirth services',
    'Health tech',
    'Healthcare blogging',
    'Medical equipment',
    'Nursing staffing agency',
    'Mental wellness',
    'Nursing home',
    'Adult Daycare',
    'Biomedical waste Management',
    'Blood Bank',
    'D/R/U/G/S',
    'Health consulting',
    'Physical therapy clinic',
    'Start manufacturing medical equipment',
    'Diabetes Clinic',
    'Drug testing',
  ];

  const home_goods = [
    'Outdoor',
    'Gifts',
    'Bedding',
    'Bath',
    'Home',
    'Accents',
    'Storage',
    'Dining',
    'Wall Decor',
    'Mirrors',
    'Kitchen',
    'Essentials',
    'Seasonal',
    'Decor',
  ];
  const ecomm = [
    'Apparels',
    'Jewelry',
    'Handbags',
    'Electronics',
    'Books',
    'Furniture',
    'Groceries',
    'Beauty products',
    'Fashion',
    'Mobile phones',
    'Movie tickets',
    'Toys and games',
    'Auto and Parts',
    'Baby products',
    'Fitness equipment',
    'Health supplements',
    'Kitchenware',
  ];
  const real_estate = ['Auditor', 'Renting a property', 'Selling A Property'];

  let type = null;
  // let options = null

  if (category === 'Animals & Pets') {
    type = animals_pets;
  } else if (category === 'Advocacy') {
    type = advocacy;
  } else if (category === 'Arts & Entertainment') {
    type = art_ent;
  } else if (category === 'Automotive') {
    type = autom;
  } else if (category === 'Attorneys & Legal Services') {
    type = attorneys;
  } else if (category === 'Beauty & Personal Care') {
    type = beauty;
  } else if (category === 'Business Services') {
    type = business;
  } else if (category === 'Dating & Personals') {
    type = dating;
  } else if (category === 'Dentists & Dental Services') {
    type = dentists;
  } else if (category === 'Education & Instruction') {
    type = edu;
  } else if (category === 'Finance & Insurance') {
    type = finance;
  } else if (category === 'Home & Home Improvement') {
    type = home_improve;
  } else if (category === 'Furniture') {
    type = furniture;
  } else if (category === 'Health & Fitness') {
    type = health;
  } else if (category === 'Health & Medical') {
    type = health_medical;
  } else if (category === 'Home Goods') {
    type = home_goods;
  } else if (category === 'E-Commerce') {
    type = ecomm;
  } else if (category === 'Real Estate') {
    type = real_estate;
  }
  const [subcategory, setSubCategory] = useState();
  const handleSubCategoryChange = (data) => {
    setSubCategory(data);
  };

  console.log(type);

  let optionList;
  // let optionList = type.map(service => ({ value: service, label: service }));
  if (type) {
    // options = type.map((el) => <option key={el}>{el}</option>)
    optionList = type.map((service) => ({ value: service, label: service }));
    console.log(optionList);
  }

  const [startDate, setStartDate] = useState();
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const [endDate, setEndDate] = useState();
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const [expBudget, setExpBudget] = useState();
  const handleExpectedBudget = (e) => {
    setExpBudget(e.target.value);
  };

  const [avgBudget, setAvgBudget] = useState();
  const handleAverageBudget = (e) => {
    setAvgBudget(e.target.value);
  };

  let [goal, setGoal] = useState([]);
  /* const handleCheckboxChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setGoal((prevSelectedItems) => [...prevSelectedItems, value])
    } else {
      setGoal((prevSelectedItems) => prevSelectedItems.filter((item) => item !== value))
    }
  }

  const [allchecked, setAllChecked] = React.useState([]) */
  function handleChange(event) {
    const { value, checked } = event.target;
    if (checked) {
      setGoal((pre) => [...pre, value]);
    } else {
      setGoal((pre) => [...pre.filter((skill) => skill !== value)]);
    }
  }
  console.log(goal);

  const location = useLocation();
  const data = location.state;
  console.log(data);
  const email = data?.email;

  console.log(email);
  const navigate = useNavigate();
  console.log(subcategory);
  let subcategories = [];
  if (subcategory) {
    for (let i = 0; i < subcategory.length; i++) {
      subcategories.push(subcategory[i].value);
    }
  }
  subcategories = subcategories.join();
  goal = goal.join();
  console.log(subcategories);
  function handleSubmit(event) {
    console.log('Hii');
    event.preventDefault();
    axios
      .post('https://api.confidanto.com/additional_details', {
        email,
        category,
        subcategories,
        expBudget,
        avgBudget,
        startDate,
        endDate,
        goal,
      })
      .then((res) => {
        // nav("https://www.confidanto.com/user-dashboard/")
        if (res.data) {
          alert("Congratulations ! You've Registered Successfully");
          navigate('/login');
        } else {
          alert('Failed to Register');
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-transparent" style={{ backgroundImage: 'url(\'background-image-url\')', width: '100%' }}>
      <div className="max-w-md bg-white bg-opacity-75 rounded-lg p-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-600">
          Additional Details
        </h2>
        <form
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <select
                id="category"
                name="category"
                className="from-input"
                value={category}
                onChange={handleCategoryChange}
              >
                <option>Select a Category</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subCategory" className="sr-only">
                Subcategory
              </label>
              <Select
                className="from-input"
                options={optionList}
                value={subcategory}
                onChange={handleSubCategoryChange}
                isMulti
                placeholder="-- Select Subcategories --"
              />
            </div>
            <div>
              <label htmlFor="expectedBudget" className="sr-only">
                Expected Budget
              </label>
              <input
                id="expectedBudget"
                name="expectedBudget"
                type="text"
                required
                className="from-input"
                placeholder="Expected Budget"
                autoComplete="expected-budget"
                onChange={handleExpectedBudget}
              />
            </div>
            <div>
              <label htmlFor="averageBudget" className="sr-only">
                Average Budget
              </label>
              <input
                id="averageBudget"
                name="averageBudget"
                type="text"
                required
                className="from-input"
                placeholder="Average Budget"
                autoComplete="average-budget"
                onChange={handleAverageBudget}
              />
            </div>
            <div>
              <label htmlFor="startDate" className="sr-only">
                Start Date
              </label>
              <input
                id="endDate"
                name="endDate"
                className="from-input"
                type="date"
                required
                placeholder="Average Budget"
                autoComplete="average-budget"
                onChange={handleStartDateChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="sr-only">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                className="from-input"
                type="date"
                required
                placeholder="Average Budget"
                autoComplete="average-budget"
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <div className="goal-div space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Goals</p>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Branding"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-700">Branding</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Conversion"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-700">Conversion</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Branding + Conversion"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                onChange={handleChange}
              />
              <span className="ml-2 text-gray-700">Branding + Conversion</span>
            </label>
          </div>
          <div>
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>

          <div className="text-sm mt-4 text-center">
            <Link
              to="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdditionalDetails;
