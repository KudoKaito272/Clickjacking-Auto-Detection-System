function tooltipON(){
  const tooltip = document.querySelector('.tooltip');
  tooltip.addEventListener('mouseenter', () => {
    const tooltipText = tooltip.querySelector('.tooltiptext');
    tooltipText.style.visibility = 'visible';
    tooltipText.style.opacity = '1';
  });

  tooltip.addEventListener('mouseleave', () => {
    const tooltipText = tooltip.querySelector('.tooltiptext');
    tooltipText.style.visibility = 'hidden';
    tooltipText.style.opacity = '0';
  });
}