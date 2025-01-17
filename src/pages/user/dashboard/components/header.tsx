import { useState, useEffect } from 'react';
import { useMatches } from "react-router-dom";
import styled from "styled-components";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../../../components/ui/breadcrumb";


export function Header() {

  
  const matches = useMatches();


    
  return (
    <HeaderStyle>
      <Breadcrumb>
        <BreadcrumbList>
          {matches.map((match, index) => {
            const breadcrumbLabel = match.pathname.split("/").pop();
            return (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={match.pathname} style={{ fontWeight: "500" }}>
                    {breadcrumbLabel}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < matches.length - 1 && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

    </HeaderStyle>
  );
}

const HeaderStyle = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
  box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  padding: 20px;
  align-items: center;

  .user-container {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-container p {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
`;
