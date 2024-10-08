import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Skull, Bitcoin, Eye, Building2,FileText, FileSpreadsheet,Calendar,MessageCircle,Download } from 'lucide-react';
import AntiBotLoading from './AntiBotLoading'; // Assurez-vous que le chemin d'importation est correct
import RansomChat from './RansomChat';  // Assurez-vous d'importer le composant


const FileIcon = ({ fileType }) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="mr-2 text-red-400" size={16} />;
    case 'csv':
      return <FileSpreadsheet className="mr-2 text-green-400" size={16} />;
    default:
      return <FileText className="mr-2 text-gray-400" size={16} />;
  }
};

const useContainerWidth = () => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);

  const handleResize = useCallback((entries) => {
    if (entries[0]) {
      setWidth(entries[0].contentRect.width);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  return [containerRef, width];
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};


const LeakContainer = ({ company }) => {
  const [showSample, setShowSample] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [containerRef, containerWidth] = useContainerWidth();

  const getTruncateLength = useCallback(() => {
    if (containerWidth < 400) return 30;
    if (containerWidth < 600) return 50;
    if (containerWidth < 800) return 70;
    return 100;
  }, [containerWidth]);

  return (
    <div ref={containerRef} className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6 border-l-4 border-red-500 text-white">
      <h3 className="text-xl font-semibold mb-3 flex items-center">
        <Building2 className="mr-2 text-yellow-500" /> {company.name}
      </h3>
      <p className="mb-2"><strong>Industry:</strong> {company.industry}</p>
      <p className="mb-2"><strong>Data Types:</strong> {company.dataTypes.join(', ')}</p>
      <p className="mb-2"><strong>Records Affected:</strong> {company.recordsAffected.toLocaleString()}</p>
      <p className="mb-2"><strong>Ransom:</strong> {company.ransom.toFixed(2)} BTC</p>
      <p className="mb-2"><strong>Deadline:</strong> {company.deadline} hours</p>
      <p className="mb-2 flex items-center">
        <Calendar className="mr-2 text-blue-400" size={16} />
        <strong>Leak Date:</strong> {company.leakDate}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
          onClick={() => setShowSample(!showSample)}
        >
          <Eye className="mr-1" size={16} /> {showSample ? "Hide" : "Show"} Sample
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
          onClick={() => setShowDocuments(!showDocuments)}
        >
          <FileText className="mr-1" size={16} /> {showDocuments ? "Hide" : "Show"} Docs
        </button>
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircle className="mr-1" size={16} /> {showChat ? "Hide" : "Show"} Chat
        </button>
        {company.sampleLink && (
          <a 
            href={`${process.env.PUBLIC_URL}${company.sampleLink}`}
            download
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
          >
            <Download className="mr-1" size={16} /> Download Sample
          </a>
        )}
      </div>
      
      {showSample && (
        <div className="mt-4 bg-gray-700 p-4 rounded">
          <h4 className="text-lg font-semibold mb-2">Sample of Leaked Data:</h4>
          <ul className="list-disc list-inside">
            {company.sampleData.map((item, index) => (
              <li key={index} className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {truncateText(item, getTruncateLength())}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showDocuments && (
        <div className="mt-4 bg-gray-700 p-4 rounded">
          <h4 className="text-lg font-semibold mb-2">Leaked Documents:</h4>
          <ul className="list-disc list-inside">
            {company.leakedDocuments.map((doc, index) => (
              <li key={index} className="mb-1 flex items-center">
                <FileIcon fileType={doc.type} />
                <a 
                  href={`${process.env.PUBLIC_URL}${doc.url}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-100 overflow-hidden text-ellipsis whitespace-nowrap"
                  title={`${doc.name} - ${doc.description}`}
                >
                  {truncateText(`${doc.name} - ${doc.description}`, getTruncateLength())}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showChat && (
        <div className="mt-4">
          <RansomChat companyName={company.name} />
        </div>
      )}
    </div>
  );
};



const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAntiBotCheckComplete, setIsAntiBotCheckComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/leakData.json`);        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const sortedCompanies = data.companies.sort((a, b) => {
          return new Date(b.leakDate) - new Date(a.leakDate);
        });
        
        setCompanies(sortedCompanies);
        setIsLoading(false);
      } catch (e) {
        console.error("Une erreur s'est produite lors du chargement des données:", e);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
        setIsLoading(false);
      }
    };

    if (isAntiBotCheckComplete) {
      fetchData();
    }
  }, [isAntiBotCheckComplete]);

  const handleAntiBotComplete = () => {
    setIsAntiBotCheckComplete(true);
  };

  const totalRansom = companies.reduce((sum, company) => sum + company.ransom, 0);

  if (!isAntiBotCheckComplete) {
    return <AntiBotLoading onLoadingComplete={handleAntiBotComplete} />;
  }

  if (isLoading) {
    return <div className="text-white text-center mt-10">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen text-green-500 font-mono">
     <header className="mb-8">
     <h1 className="text-4xl font-bold mb-4 text-red-500 flex items-center justify-center">
          <Skull className="mr-2" /> Fake Ransomware Group
        </h1>
     <div className="flex justify-center mb-4">
          <img 
            src={`${process.env.PUBLIC_URL}/images/fake-ransomware-logo.png`} 
            alt="Fake Ransomware Group Logo" 
            className="max-w-xs w-full h-auto"
          />
        </div>
       
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-red-500">
          <p className="text-sm mb-2">
            Welcome to the simulated dashboard of the "Fake Ransomware Group". We are a fictional entity created for cybersecurity training purposes.
          </p>
          <p className="text-sm mb-2">
            Our mission: To demonstrate the potential impact of ransomware attacks and help organizations improve their security posture.
          </p>
          <p className="text-sm font-bold text-yellow-300">
            Remember: This is a simulated environment. All data and actions presented here are fictional and for educational purposes only.
          </p>
        </div>
      </header>

      <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6 border border-green-500">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Bitcoin className="mr-2" /> Total Ransom Demanded
        </h2>
        <p className="text-3xl font-bold">{totalRansom.toFixed(2)} BTC</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-green-400">Active Data Leaks by Company</h2>
      
      {companies.map((company, index) => (
        <LeakContainer key={index} company={company} />
      ))}

      <div className="mt-8 bg-red-900 border border-red-500 p-4 rounded-lg text-white">
        <h3 className="font-semibold text-lg mb-2">Warning</h3>
        <p>This is a simulated environment for authorized training purposes only. All data and actions are fictional.</p>
      </div>
    </div>
  );
};

export default Dashboard;