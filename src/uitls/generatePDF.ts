import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

export const generatePDF = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (elementRef.current) {
    try {
      // Capture the div as an image
      // const dataUrl = await domtoimage.toPng(elementRef.current, { useCORS: true });
      // const dataUrl = await domtoimage.toPng(elementRef.current, {  bgcolor: '#ffffff' });
      const dataUrl = await domtoimage.toPng(elementRef.current);
      
      const pdf = new jsPDF("p", "pt", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      const imgWidth = pageWidth;
      const imgHeight = (elementRef.current.clientHeight * imgWidth) / elementRef.current.clientWidth;

      let positionY = 0; // Initial Y position on the PDF

      // Loop to add new pages if content exceeds one page
      while (positionY < imgHeight) {
        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          -positionY, // Move the image up by the current Y position
          imgWidth,
          imgHeight
        );

        positionY += pageHeight; // Move to the next page's height

        if (positionY < imgHeight) {
          pdf.addPage();
        }
      }

      pdf.save("post.pdf"); // Download the PDF
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  }
};
