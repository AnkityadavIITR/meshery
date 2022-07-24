import React, {useState} from 'react'
import { AppBar, Box, Button, Grid, Dialog, DialogTitle, Divider, DialogContent, DialogActions, Tooltip, Hidden, IconButton, Toolbar, Typography, TableCell, TableSortLabel } from "@mui/material";
import MUIDataTable from "mui-datatables";
// import Moment from "react-moment";
import { styled } from "@mui/material/styles";
import UploadImport from "@/components/UploadImport";
import ViewSwitch from "@/components/ViewSwitch";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MesheryPatternGrid from "./MesheryPatternGrid"
import { useTheme } from "@mui/system";

function resetSelectedPattern() {
  return { show : false, pattern : null };
}


function Mesherypatterns({user}) {
  const theme = useTheme();  

  const CustomBox = styled(Box)(({theme}) => ({
    justifySelf : "flex-end",
    marginLeft : "auto",
    paddingLeft : theme.spacing(2),
 }))

    const [patterns, setpatterns] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedPattern, setSelectedPattern] = useState(resetSelectedPattern());
    const [modalOpen, setModalOpen] = useState({
      open : false,
      deploy : false,
      pattern_file : null
    });
    const [viewType, setViewType] = useState(
      /**  @type {TypeView} */
      ("grid")
    ); 

    function resetSelectedRowData() {
      return () => {
        setSelectedRowData(null);
      };
    }

    function fetchpatterns(page, pageSize, search, sortOrder) {
      if (!search) search = "";
      if (!sortOrder) sortOrder = "";

      const query = `?page=${page}&page_size=${pageSize}&search=${encodeURIComponent(search)}&order=${encodeURIComponent(
        sortOrder
      )}`;

      updateProgress({ showProgress : true });

      dataFetch(
        `/api/pattern${query}`,
        { credentials : "include", },
        (result) => {
          console.log("patternFile API", `/api/pattern${query}`);
          updateProgress({ showProgress : false });
          if (result) {
            setpatterns(result.patterns || []);
            setCount(result.total_count || 0);
          }
        },
        // handleError
        handleError(ACTION_TYPES.FETCH_patternS)
      );
    }

    const patterns1 = [
      {
        id: "e7ccec75-bec6-4b28-b450-272aefa8a182",
        name: "IstioFilterPattern.yaml",
        user_id: "f714c166-5113-4f52-844c-38f0672b5e60",
        created_at: "2022-07-14T13:50:46.375252Z",
updated_at: "2022-07-14T13:53:35.479756Z"
        },
        {
        id: "fb43eb24-de45-481a-955c-3916440276eb",
        name: "IstioFilterPattern (1).yaml",
        user_id: "f714c166-5113-4f52-844c-38f0672b5e60",
        created_at: "2022-07-14T13:50:46.375252Z",
updated_at: "2022-07-14T13:53:35.479756Z"
  }
    ];


    const handleClick = () => setpatterns(patterns1);;

    const handleModalClose = () => {
      setModalOpen({
        open : false,
        pattern_file : null
      });
    }

    const handleModalOpen = (app_file, isDeploy) => {
      setModalOpen({
        open : true,
        deploy : isDeploy,
        pattern_file : app_file
      });
    }


    const columns = [
        {
          name : "name",
          label : "pattern Name",
          options : {
            filter : false,
            sort : true,
            searchable : true,
            customHeadRender : function CustomHead({ index, ...column }, sortColumn) {
              return (
                <TableCell key={index} onClick={() => sortColumn(index)}>
                  <TableSortLabel active={column.sortDirection != null} direction={column.sortDirection || "asc"}>
                    <b>{column.label}</b>
                  </TableSortLabel>
                </TableCell>
              );
            },
          },
        },
        {
          name : "created_at",
          label : "Upload Timestamp",
          options : {
            filter : false,
            sort : true,
            searchable : true,
            customHeadRender : function CustomHead({ index, ...column }, sortColumn) {
              return (
                <TableCell key={index} onClick={() => sortColumn(index)}>
                  <TableSortLabel active={column.sortDirection != null} direction={column.sortDirection || "asc"}>
                    <b>{column.label}</b>
                  </TableSortLabel>
                </TableCell>
              );
            },
          },
        },
        {
          name : "updated_at",
          label : "Update Timestamp",
          options : {
            filter : false,
            sort : true,
            searchable : true,
            customHeadRender : function CustomHead({ index, ...column }, sortColumn) {
              return (
                <TableCell key={index} onClick={() => sortColumn(index)}>
                  <TableSortLabel active={column.sortDirection != null} direction={column.sortDirection || "asc"}>
                    <b>{column.label}</b>
                  </TableSortLabel>
                </TableCell>
              );
            },
            // customBodyRender : function CustomBody(value) {
            //   return <Moment format="LLLL">{value}</Moment>;
            // },
          },
        },
        {
          name : "Actions",
          options : {
            filter : false,
            sort : false,
            searchable : false,
            customHeadRender : function CustomHead({ index, ...column }) {
              return (
                <TableCell key={index}>
                  <b>{column.label}</b>
                </TableCell>
              );
            },
            customBodyRender : function CustomBody(_, tableMeta) {
              const rowData = patterns[tableMeta.rowIndex];
              return (
                <>
                  <IconButton
                    title="Deploy"
                    onClick={() => handleModalOpen(rowData.pattern_file, true)}
                  >
                    <DoneAllIcon data-cy="deploy-button" />
                  </IconButton>
                  <IconButton
                    title="Undeploy"
                    onClick={() => handleModalOpen(rowData.pattern_file, false)}
                  >
                    {/* <UndeployIcon fill="rgba(0, 0, 0, 0.54)" data-cy="undeploy-button" /> */}
                  </IconButton>
                </>
              );
            },
          },
        },
      ];

      const options = {
        filter : false,
        sort : !(user && user.user_id === "meshery"),
        search : !(user && user.user_id === "meshery"),
        filterType : "textField",
        // responsive : "scrollFullHeight",
        resizableColumns : true,
        serverSide : true,
        rowsPerPageOptions : [10, 20, 25],
        fixedHeader : true,
        print : false,
        download : false,
        textLabels : {
          selectedRows : {
            text : "pattern(s) selected"
          }
        },
        onCellClick : (_, meta) => meta.colIndex !== 3 && setSelectedRowData(patterns[meta.rowIndex]),
    }

  return (
    <div> 
      <Button onClick={handleClick}>QWE</Button>     
      <Box sx={{display: "flex"}}>  

       <UploadImport configuration="patterns" />
       <CustomBox >
            <ViewSwitch view={viewType} changeView={setViewType} />
          </CustomBox>
       </Box> 
       {console.log(patterns1.name +"qwert")}
    {!selectedPattern.show &&  viewType==="table" &&   
         <MUIDataTable
    title={<div>patterns</div>}
    data={patterns}
    columns={columns}
    options={options}    
  />
}
    {!selectedPattern.show &&  viewType==="grid" &&   
             <MesheryPatternGrid
            patterns={patterns}
            //  handleDeploy={handleDeploy}
            //  handleUnDeploy={handleUnDeploy}
            //  handleSubmit={handleSubmit}
             setSelectedPattern={setSelectedPattern}
             selectedPattern={selectedPattern}
            //  pages={Math.ceil(count / pageSize)}
            //  setPage={setPage}
            //  selectedPage={page}
           />
}

  </div>
  )
}

export default Mesherypatterns