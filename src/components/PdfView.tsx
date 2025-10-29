import { useState } from "react";
import { Document, Page } from "react-pdf";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import  AnnualReport from "../assets/pdf/AnnualReport.pdf";


// @/assets/pdf

const PdfView = () => {

    console.log(AnnualReport);
    

  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

// function onDocumentLoadSuccess(data: any){

//     console.log("data");
    
//     console.log('Document loaded successfully',data);
// }

  return (
    <div>
      <Document file={AnnualReport} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
};

export default PdfView;
