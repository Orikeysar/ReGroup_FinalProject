import React from "react";

const OverLayMap = ({ position, children, onClick }) => {
  const [overlayView, setOverlayView] = React.useState(null);

  const createOverlayView = (map) => {
    const overlayView = new window.google.maps.OverlayView();

    overlayView.onAdd = function () {
      this.getPanes().floatPane.appendChild(this.container);
    };

    overlayView.draw = function () {
      const divPosition = this.getProjection().fromLatLngToDivPixel(position);
      this.container.style.left = `${divPosition.x}px`;
      this.container.style.top = `${divPosition.y}px`;
    };

    overlayView.onRemove = function () {
      this.container.parentNode.removeChild(this.container);
    };

    overlayView.container = document.createElement("div");
    overlayView.container.style.position = "absolute";
    overlayView.container.appendChild(children);

    overlayView.container.addEventListener("click", onClick);

    overlayView.setMap(map);
    setOverlayView(overlayView);
  };

  React.useEffect(() => {
    if (window.google && window.google.maps) {
      createOverlayView(window.google.maps.Map.instance);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (overlayView) {
        overlayView.setMap(null);
      }
    };
  }, [overlayView]);

  return null;
};
export default OverLayMap;