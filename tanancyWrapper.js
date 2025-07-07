import { useEffect, useState } from 'react';
import { useAppContext } from './context';
import { Spinner } from '@openedx/paragon';

const TanancyWrapper = ({ children }) => {
  const { customization, multiTenancyLoading, setMultiTenancyLoading } = useAppContext();

  const [colors, setColors] = useState({
    activeColor: customization?.colors?.INDIGO_PRIMARY_COLOR || "#15376D",
    activeHoverColor: customization?.colors?.INDIGO_PRIMARY_COLOR || "#15376D",
    hoverColor: customization?.colors?.INDIGO_PRIMARY_COLOR || "#15376D",
    linksColor: customization?.colors?.INDIGO_LINKS_COLOR || "#15376D",
    linksColorHover: customization?.colors?.INDIGO_LINKS_HOVER_COLOR || "#15376D",
  });

  useEffect(() => {
    if (customization) {
      setColors({
        activeColor: customization?.colors?.INDIGO_PRIMARY_COLOR || "#15376D",
        activeHoverColor: customization?.colors?.INDIGO_PRIMARY_COLOR || "#15376D",
        hoverColor: customization?.colors?.INDIGO_PRIMARY_COLOR || "#15376D",
        linksColor: customization?.colors?.INDIGO_LINKS_COLOR || "#15376D",
        linksColorHover: customization?.colors?.INDIGO_LINKS_HOVER_COLOR || "#15376D",
      });
    }
  }, [customization]);

  if (multiTenancyLoading) {
    return  (
     <div className="mw-xs mx-auto pt-3 text-center">
        <Spinner animation="border" variant="primary" />
    </div>
    )
  }

  return (
    <div
      style={{
        "--active-bg": colors?.activeColor,
        "--active-hover-bg": colors?.activeHoverColor,
        "--hover-bg": colors?.hoverColor,
        "--links-color": colors?.linksColor,
        "--links-color-hover": colors?.linksColorHover,
      }}
    >
      {children}
    </div>
  );
};

export default TanancyWrapper;
