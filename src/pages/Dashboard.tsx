import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import "./Dashboard.scss"
import { useAuthenticationState, userService } from "../state/user";
import { File, fileService, useFileState } from "../state/files";
import Button from "../components/Button";
import { format } from "date-fns";
import { API_URL } from "../state/Request";
import { BounceLoader } from "react-spinners";
import Input from "../components/Input";

const Dashboard = () => {
	const history = useHistory();
	const [navState, setNavState] = useState("files");
	const { currentPage, totalPages, files, isLoading: filesLoading } = useFileState();
	const { user, error } = useAuthenticationState();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const copyUrlToClipboard = (file: File) => {
		navigator.clipboard.writeText(`${API_URL}/${file.name}`);
	}

	const copyTokenToClipboard = () => {
		navigator.clipboard.writeText(user?.apiToken ?? "");
	}

	const updatePassword = () => {
		userService.changePassword({
			password: oldPassword,
			newPassword: newPassword,
		});
	}
	
	const renderImage = (x: File) => {
		if (x.name.includes(".png") || x.name.includes(".jpg") || 
			x.name.includes(".gif") || x.name.includes(".jpeg") ||
			x.name.includes(".webp")) {
			const url = `${API_URL}/${x.name}`;
			return (
				<div className="row-name">
					<img className="row-image" src={url} />
				</div>
			)
		} else {
			return (
				<div className="row-name"></div>
			)
		}
	}

	const loadMore = () => {
		fileService.loadMoreFiles();
	}

	const content = () => {
		switch (navState) {
			case "files":
				return (
					<section className="dashboard-files">
						{filesLoading ? (
							<div className="loading">
								<BounceLoader color={"#44E384"} />
							</div>
						) : (
						<>
							<section className="file-table">
								<div className="table-header">
									<span className="header-name">Preview</span>
									<span className="header-name">Original file name</span>
									<span className="header-size">Size</span>
									<span className="header-date">Date uploaded</span>
									<span className="header-link">Link</span>
									<span className="header-link">Delete?</span>
								</div>
								<div className="table-content">
									{files.map((x) => {
										return (
											<div className="table-row" key={x.id}>
												{renderImage(x)}
												<div className="row-name">
													{x.originalName}
												</div>
												<div className="row-size">
													<span>{x.fileSizeInKB > 1000 ? `${(x.fileSizeInKB / 1000).toFixed(2)} MB` : `${x.fileSizeInKB} KB`}</span>
												</div>
												<div className="row-date">
													<span>{format(new Date(x.createdAt), "dd MMM HH:mm aaa")}</span>
												</div>
												<Button className="row-link" small={true} transparent={true} text={"Copy"} onClick={() => copyUrlToClipboard(x)}/>
												<Button className="row-delete" small={true} transparent={true} text={"Delete"} onClick={() => copyUrlToClipboard(x)}/>
											</div>
										)
									})}
								</div>
							</section>
							<div className="table-nav">
								<Button 
									text={"Load more"}
									className="load-more-button" 
									onClick={loadMore} />
							</div>
						</>
						)}
					</section>
				);
			case "account":
				return (
					<section className="dashboard-account">
						<Input disabled={true} id={"username"} placeholder={user?.username} label={"Username"}/>
						<Input disabled={true} id={"email"} placeholder={user?.email ?? ""} label={"Email"}/>
						<div className="token-input">
							<Input disabled={true} id={"token"} placeholder={user?.apiToken} label={"Api Token"}/>
							<Button text={"Copy"} className="token-copy" onClick={() => copyTokenToClipboard()}/>
						</div>
						<form className="password-update" onSubmit={() => updatePassword()}>
							<label className="password-update-error">{error}</label>
							<label className="password-update-success">{user?.message}</label>
							<Input id={"oldpass"} label={"Old password"} type={"password"} onChange={(val: string) => setOldPassword(val)}/>
							<Input id={"newpass"} label={"New Password"} type={"password"} onChange={(val: string) => setNewPassword(val)}/>
							<Button text={"Update password"} type="button" onClick={() => updatePassword()} />
						</form>
					</section>
				);
		}
	};

	const onLogout = () => {
		userService.logout();
		history.push("home");
		console.info("Logged out");
	}

	return (
		<>
			<section className="route" id="dashboard">
				<nav className="dashboard-menu">
					<button className="menu-item" onClick={() => setNavState("files")}>Files</button>
					<button className="menu-item" onClick={() => setNavState("account")}>Account</button>
					<button className="menu-item" onClick={onLogout}>Log Out</button>
				</nav>
				<section className="dashboard-content">
					{content()}
				</section>
			</section>
		</>
	);
};

export default Dashboard;